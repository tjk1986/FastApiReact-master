from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.preprocessing import StandardScaler, MaxAbsScaler
from sklearn.preprocessing import OneHotEncoder

from scipy.sparse import hstack, csr_matrix
import numpy as np

import json
import pickle
import os

import time


class Data:
    def __init__(self, train_df, full_df, settings, encoders=None):
        self.train_df = train_df
        self.full_df = full_df
        self.settings = settings
        self.models = {}
        self.scaler = False
        self.X_train = None
        self.X_test = None
        self.encoders = encoders

    def concatenate_data(self, index, data, mode):
        # Initilialize array if first
        if index == 0:
            if mode == 'train':
                self.X_train = data
            if mode == 'test':
                self.X_test = data
            return

        # Concatenates the new data to existing training set
        if mode == 'train':
            print(f'index {index} :', data.shape)
            self.X_train = hstack([self.X_train, data])
        if mode == 'test':
            self.X_test = hstack([self.X_test, data])

    def preprosess(self):
        # Find training columns
        print("Find training columns")
        filtered_columns = []
        for idx, col in enumerate(self.settings['columns']):
            if col['training']:
                filtered_columns.append(col)

        # Iterate trought training columns
        print("# Iterate trought training columns")
        for idx, col in enumerate(filtered_columns):
            if col['type'] == 'Linear':
                column = col['column']

                # Set scaler true if linear data
                self.scaler = True

                # Reshape data
                train_data = self.train_df[column]
                test_data = self.full_df[column]

                train_data = csr_matrix(train_data.values.reshape(-1, 1))
                test_data = csr_matrix(test_data.values.reshape(-1, 1))

                # Transform_data
                self.concatenate_data(idx, train_data, 'train')
                self.concatenate_data(idx, test_data, 'test')

            if col['type'] == 'Categorical':
                # Fit the encoder
                print("# Fit the encoder", col['column'])
                column = col['column']

                if self.encoders == None:
                    encoder = OneHotEncoder(handle_unknown='ignore')
                else:
                    encoder = self.encoders[column]

                # Reshape data
                train_data = self.train_df[column].to_numpy().reshape(-1, 1)
                test_data = self.full_df[column].to_numpy().reshape(-1, 1)

                if self.encoders == None:
                    encoder.fit(train_data)
                    self.models[column] = encoder

                # Transform_data
                train_data = encoder.transform(train_data)  # .toarray()
                test_data = encoder.transform(test_data)  # .toarray()
                self.concatenate_data(idx, train_data, 'train')
                self.concatenate_data(idx, test_data, 'test')

            if col['type'] == 'Text':
                # Fit the countvectorizer
                print("# Fit the countvectorizer")
                column = col['column']

                if self.encoders == None:
                    vectorizer = CountVectorizer()
                else:
                    vectorizer = self.encoders[column]

                train_data = self.train_df[column]
                test_data = self.full_df[column]

                if self.encoders == None:
                    vectorizer.fit(train_data)
                    self.models[column] = vectorizer

                # Transform_data
                train_data = vectorizer.transform(train_data)
                test_data = vectorizer.transform(test_data)
                self.concatenate_data(idx, train_data, 'train')
                self.concatenate_data(idx, test_data, 'test')

    def scale(self):

        # Something wrong with key ouput_type must inited in loop
        for i in self.settings.keys():
            if i == 'ouput_type':
                output_type = self.settings[i]

        # Select scaler
        if output_type == 'Linear':

            scaler = StandardScaler(with_mean=False)
        else:
            scaler = MaxAbsScaler()

        # fit and store scaler
        scaler.fit(self.X_train)
        self.models['scaler'] = scaler

        self.X_train = scaler.transform(self.X_train)
        self.X_test = scaler.transform(self.X_test)

        print("data scaled")


def test_model(df, model_name, MODEL_PATH, VECTOR_PATH, SETTINGS_PATH):
    # Define paths
    file = model_name.split('.')[0]
    path = os.path.join(VECTOR_PATH, f"{file}.pkl")
    settings_path = os.path.join(SETTINGS_PATH, f"{file}.json")
    model_path = os.path.join(MODEL_PATH, f"{file}.pkl")

    # Open settings
    with open(settings_path) as f:
        settings = json.load(f)

    with open(path, 'rb') as f:
        encoders = pickle.load(f)

    M = Data(df, df, settings, encoders)
    M.preprosess()

    X_train = M.X_train

    if M.scaler:
        X_train = encoders['scaler'].transform(X_train)

    with open(model_path, 'rb') as f:
        model = pickle.load(f)

    pred = model.predict(X_train)

    for i in settings.keys():
        if i == 'ouput_type':
            output_type = settings[i]

    # Select scaler
    if output_type == 'Categorical':
        proba = model.predict_proba(X_train)
        prob_dicts = [dict(zip(model.classes_, prob))
                      for prob in proba]
        return {"pred": pred.tolist(), "proba": prob_dicts}

    return pred


def train(df, fileName, MODEL_PATH, VECTOR_PATH, SETTINGS_PATH):

    # Define paths
    file = fileName.split('.')[0]
    path = os.path.join(VECTOR_PATH, f"{file}.pkl")
    settings_path = os.path.join(SETTINGS_PATH, f"{file}.json")

    # Open settings
    with open(settings_path) as f:
        settings = json.load(f)

    # Create filtered  dataset
    trainDf = df.copy()

    filt = (df[settings['target']].notna()) & (df[settings['target']] != "")
    trainDf = trainDf[filt]

    M = Data(df, trainDf, settings)
    M.preprosess()
    if M.scaler:
        M.scale()

    # Save model
    with open(path, 'wb') as f:
        pickle.dump(M.models, f)

    # X, y
    X_test = M.X_test
    X_train = M.X_train

    # Target and model
    if settings['ouput_type'] == 'Linear':
        if settings['shift'] < 0:
            y_test = trainDf[settings['target']].shift(settings['shift'])
            y_test = y_test[:settings['shift']]
            X_test = X_test[:settings['shift']]
        else:
            y_test = trainDf[settings['target']]
        model = LinearRegression()

    if settings['ouput_type'] == 'Categorical':
        y_test = trainDf[settings['target']]
        model = LogisticRegression()

    model.fit(X_test, y_test)

    # Save model
    path = os.path.join(MODEL_PATH, f"{file}.pkl")
    with open(path, 'wb') as f:
        pickle.dump(model, f)

    pred = model.predict(X_train)

    return pred
