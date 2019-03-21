#Find the sum of the digits in the number 100!

#Answer: 648

def SumOfDigits (a):
    b = list(str (a))
    s = 0
    for i in range (0, len(b)):
        s += int (b[i])
    return s

def Factorial (n):
    x = 1
    for i in range (2, n + 1):
        x *= i
    return x

print (SumOfDigits (Factorial (100)))
