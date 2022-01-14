import matplotlib.pyplot as plt
from math import factorial as sil


def B(i, n, t):
    sn = sil(n)/(sil(i)*sil(n-i))
    return sn * (1-t)**(n-i) * t**i


def bezier_spline(pk: list, segmenty: int):
    spline = []
    for ts in range(segmenty+1):
        t = ts/segmenty
        P = [0.0, 0.0]
        n = len(pk)-1
        for index, k in enumerate(pk):
            P[0] += k[0]*B(index, n, t)
            P[1] += k[1]*B(index, n, t)
        spline.append(P)
    return spline


if __name__ == "__main__":
    p0 = [float(x) for x in input("Punkt 0 (x, y, d): ").split(" ")]
    p1 = [float(x) for x in input("Punkt 1 (x, y, d): ").split(" ")]

    # Obliczanie puntów kontrolnych
    b0 = p0[1] - p0[2]*p0[0]
    b1 = p1[1] - p1[2]*p1[0]
    x = (b1-b0)/(p0[0]-p1[0])
    y = p0[2]*x+b0
    pk = [tuple(p0[:2]), (x, y), tuple(p1[:2])]

    spl = bezier_spline(pk, 10)

    xvals, yvals = tuple(zip(*spl))
    plt.plot(xvals, yvals, "-", xvals, yvals, "o")
    plt.grid(True)
    plt.show()
