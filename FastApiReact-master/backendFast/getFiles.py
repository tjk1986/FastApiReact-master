import os
from datetime import datetime


def timeConvert(atime):
    dt = atime
    newtime = datetime.fromtimestamp(dt)
    return newtime.date()


def sizeFormat(size):
    newform = format(size/1024, ".2f")
    return newform + " KB"


def createFileRecords(somepath):
    # dictionary
    files = []

    for name in os.listdir(somepath):

        filepath = os.path.join(somepath, name)

        # main library that holds stats
        stats = os.stat(filepath)

        attrs = {
            'File Name': name,
            'File Type': name.split('.')[1],
            'Size (KB)': sizeFormat(stats.st_size),
            'Creation Date': timeConvert(stats.st_ctime),
            'Modified Date': timeConvert(stats.st_mtime),
            'Last Access Date': timeConvert(stats.st_atime),
        }

        files.append(attrs)

    return files
