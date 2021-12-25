import numpy as np


def f(x, x1, y1, y2, y3):
    licznik = -y1*x*np.cos(np.arctan((y2-y3)/(x*y1)) - (x*x1)/2)
    mianownik = np.sin((-x*x1)/2)*np.cos(np.arctan((y2-y3)/(x*y1)))
    return licznik/mianownik - y2


def fsolve(x1, y1, y2, y3):
    assert x1 != 0
    assert y1 != 0
    pass