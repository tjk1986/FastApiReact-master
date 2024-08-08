// Store
import { useGetData } from "../../store/store";

function Model() {
  const settings = useGetData((state) => state.settings);
  const setSettings = useGetData((state) => state.setSettings);
  const saveSettings = useGetData((state) => state.saveSettings);

  const linearModels = [
    {
      name: "LinearRegression",
      desc: "LinearRegression fits a linear model with coefficients to minimize the residual sum of squares between the observed targets in the dataset, and the targets predicted by the linear approximation.",
      disabled: false,
    },
    {
      name: "Ridge",
      desc: "Ridge regression addresses some of the problems of Ordinary Least Squares by imposing a penalty on the size of the coefficients. The ridge coefficients minimize a penalized residual sum of squares",
      disabled: true,
    },
    {
      name: "Bayesian Regression",
      desc: "Bayesian regression techniques can be used to include regularization parameters in the estimation procedure: the regularization parameter is not set in a hard sense but tuned to the data at hand.",
      disabled: true,
    },
    {
      name: "SGDRegressor",
      desc: "SGD stands for Stochastic Gradient Descent: the gradient of the loss is estimated each sample at a time and the model is updated along the way with a decreasing strength schedule (aka learning rate).",
      disabled: true,
    },
    {
      name: "Neural network: MLPClassifier",
      desc: "MLP trains on two arrays: array X of size (n_samples, n_features), which holds the training samples represented as floating point feature vectors; and array y of size (n_samples,), which holds the target values (class labels) for the training samples:",
      disabled: true,
    },
  ];

  const classifigationModels = [
    {
      name: "LogisticRegression",
      desc: "Despite its name, it is implemented as a linear model for classification rather than regression in terms of the scikit-learn/ML nomenclature. The logistic regression is also known in the literature as logit regression, maximum-entropy classification (MaxEnt) or the log-linear classifier. In this model, the probabilities describing the possible outcomes of a single trial are modeled using a logistic function.",
      disabled: false,
    },
    {
      name: "SVM",
      desc: "The implementation is based on libsvm. The fit time scales at least quadratically with the number of samples and may be impractical beyond tens of thousands of samples. For large datasets consider using LinearSVC or SGDClassifier instead, possibly after a Nystroem transformer or other Kernel Approximation.",
      disabled: true,
    },
    {
      name: "SGDClassifier",
      desc: "This estimator implements regularized linear models with stochastic gradient descent (SGD) learning: the gradient of the loss is estimated each sample at a time and the model is updated along the way with a decreasing strength schedule (aka learning rate). SGD allows minibatch (online/out-of-core) learning via the partial_fit method. For best results using the default learning rate schedule, the data should have zero mean and unit variance.",
      disabled: true,
    },
    {
      name: "KNeighborsClassifier",
      desc: "Neighbors-based classification is a type of instance-based learning or non-generalizing learning: it does not attempt to construct a general internal model, but simply stores instances of the training data. Classification is computed from a simple majority vote of the nearest neighbors of each point: a query point is assigned the data class which has the most representatives within the nearest neighbors of the point.",
      disabled: true,
    },
    {
      name: "Neural network: MLPRegressor",
      desc: "Implements a multi-layer perceptron (MLP) that trains using backpropagation with no activation function in the output layer, which can also be seen as using the identity function as activation function. Therefore, it uses the square error as the loss function, and the output is a set of continuous values.",
      disabled: true,
    },
  ];

  const handleClick = (event) => {
    console.log(settings, event.target.value);
    setSettings({ type: "model", value: event.target.value });
    saveSettings();
    event.target.blur();
  };

  return (
    <div className="flex flex-col items-center w-h h-full py-5 overflow-y-auto">
      <div className="flex flex-col items-center w-[80%] h-full">
        <div className="container container-sm max-w-[500px]">
          <fieldset className="space-y-4">
            <legend className="sr-only">Delivery</legend>
            {settings["ouput_type"] === "Linear"
              ? linearModels.map((value, index) => (
                  <div key={index}>
                    <label
                      htmlFor="Model"
                      className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                    >
                      <div>
                        <p className="text-gray-700 dark:text-gray-200">
                          {value.name}
                        </p>

                        <p className="mt-1 text-xs font-light">{value.desc}</p>
                      </div>

                      <input
                        className="size-5 border-gray-300 text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900"
                        type="radio"
                        name={value.name}
                        disabled={value.disabled}
                        id={index}
                        value={value.name}
                        checked={value.name === settings["model"]}
                        onChange={(event) => handleClick(event)}
                      />
                    </label>
                  </div>
                ))
              : classifigationModels.map((value, index) => (
                  <div key={index}>
                    <label
                      htmlFor="Model"
                      className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                    >
                      <div>
                        <p className="text-gray-700 dark:text-gray-200">
                          {value.name}
                        </p>

                        <p className="mt-1 text-xs font-light">{value.desc}</p>
                      </div>

                      <input
                        type="radio"
                        className="size-5 border-gray-300 text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900"
                        name={value.name}
                        disabled={value.disabled}
                        id={index}
                        value={value.name}
                        checked={value.name === settings["model"]}
                        onChange={(event) => handleClick(event)}
                      />
                    </label>
                  </div>
                ))}
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default Model;
