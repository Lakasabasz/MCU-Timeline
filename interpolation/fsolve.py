import numpy as np
import matplotlib.pyplot as plt


def f(x, x1, y1, y2, y3):
    licznik = -y1*x*np.cos(np.arctan((y2-y3)/(x*y1)) - (x*x1)/2)
    mianownik = 2*np.sin((-x*x1)/2)*np.cos(np.arctan((y2-y3)/(x*y1)))
    return licznik/mianownik - y2


def h(f0, x1, y1, y2, y3):
    return -(np.arctan((y2-y3)/(f0*y1))-(f0*x1)/2)


def a(f0, h0, x1, y1):
    return -y1/(np.sin(-h0)-np.sin(f0*x1-h0))


def v(a0, h0):
    return -a0*np.sin(-h0)


def dsin(x, a0, f0, h0):
    return a0*f0*np.cos(f0*x-h0)


def fsolve(x1, y1, y2, y3, a=0.00001, eps=0.001):
    assert x1 != 0
    assert y1 != 0
    argset = (x1, y1, y2, y3)
    b = 2*np.pi/x1
    mid = 0
    fmid = 0
    if f(a, *argset) * f(b, *argset) > 0:
        print('Cannot fully solve')

    while not b-a < eps:
        mid = (a + b) / 2
        fmid = f(mid, *argset)
        if fmid > 0:
            a = mid
        elif fmid < 0:
            b = mid
        else:
            return mid
    print("Dokładność x = f(x)", mid, fmid)
    return (a+b)/2


if __name__ == "__main__":
    # Funkcja od (0, 0) do
    P1 = (1, -1)

    # Z pochodną w x=0
    dx0 = 0

    # Z pochodną w P1
    dx1 = -1.9

    f0 = fsolve(P1[0], P1[1], dx0, dx1, eps=10**(-3))
    h0 = h(f0, P1[0], P1[1], dx0, dx1)
    a0 = a(f0, h0, P1[0], P1[1])
    v0 = v(a0, h0)

    print("Współczynniki", f0, h0, a0, v0)

    r = 10**(-2)

    Xvals, Yvals = [0], [0]
    while Xvals[-1] < P1[0]:
        tga = dsin(Xvals[-1], a0, f0, h0)
        a = np.arctan(tga)
        x = Xvals[-1] + r*np.cos(a)
        if x > P1[0]:
            break
        Yvals.append(a0*np.sin(f0*x-h0)+v0)
        Xvals.append(x)
    Xvals.append(P1[0])
    Yvals.append(a0*np.sin(f0*P1[0]-h0)+v0)

    dP0 = (Yvals[1]-Yvals[0])/(Xvals[1]-Xvals[0])
    dP1 = (Yvals[-1]-Yvals[-2])/(Xvals[-1]-Xvals[-2])
    print("Pochodne", dP0, dP1)

    plt.plot(Xvals, Yvals, 'o', [0, P1[0]], [0, P1[1]], 'o')
    plt.grid(True)
    plt.show()
