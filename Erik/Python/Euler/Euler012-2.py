#What is the value of the first triangle number to have over five hundred divisors?

#Answer: 76576500

def IsPrime2 (number):
    if (number <= 1):
        return False
    elif (number <= 3):
        return True
    elif (number % 2 == 0 or number % 3 == 0):
        return False
    i = 6
    while (i * i <= number):
        if (number % (i - 1) == 0 or number % (i + 1) == 0):
            return False
        i += 6
    return True

def NextPrime (p):
    newPrime = p + 1
    while (not IsPrime2 (newPrime)):
        newPrime += 1
    return newPrime

def TriangleNumber (i):
    return sum (range (1, i + 1), 0)

a = 1
j = 0

while (not a > 500):
    j += 1
    i = 2
    a = 1
    b = 1
    n = TriangleNumber (j)
    #print (n)
    #print ("n:",n)
    while (n != 1):
        lasti = i
        while (n % i == 0):
            n = n / i
            #print (i)
            b += 1
        a *= b
        b = 1
        i = NextPrime (i)
    #print ("a:",a)

print ("n:",TriangleNumber (j),"a:",a)
