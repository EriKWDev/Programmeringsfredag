#What is the sum of the digits of the number 2**1000?

#Answer: 1366
n = 2**1000

def SumOfDigits (a):
    b = list(str (a))
    s = 0
    for i in range (0, len(b)):
        s += int (b[i])
    return s

print (SumOfDigits (n))