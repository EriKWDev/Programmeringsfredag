#What is the value of the first triangle number to have over five hundred divisors?

#Answer: 76576500

def TriangleNumber (i):
    return sum (range (1, i + 1), 0)

def NumberOfDivisors (x):
    n = 2
    for i in range (2, x):
        if (x % i == 0):
            n += 1
    return n

i = 0

while (not NumberOfDivisors (TriangleNumber (i)) > 500):
    i+=1

print (TriangleNumber (i), NumberOfDivisors (TriangleNumber (i)))