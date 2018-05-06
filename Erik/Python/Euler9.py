#There exists exactly one Pythagorean triplet for which a + b + c = 1000.
#Find the product abc.

#Answer: 31875000

def FindNumbers ():
    a = b = c = c2 = 1
    for a in range (1, 1000):
        for b in range (1, 1000):
            c = 1000 - a - b
            c2 = (a * a) + (b * b)
            if (c != 0 and c2 / c == c):
                print (a, b, c)
                print (a*b*c)
                return

FindNumbers ()