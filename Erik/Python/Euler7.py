#What is the 10 001st prime number?

#Answer: 56183

def IsPrime2 (number):
    if (number <= 1):
        return False
    elif (number <= 3):
        return True
    elif (number % 2 == 0 or number % 3 == 0):
        return False
    i = 5
    while (i * i <= number):
        if (number % i == 0 or number % (i + 2) == 0):
            return False
        i += 6
    return True

def NextPrime (p):
    newPrime = p + 1
    while (not IsPrime2 (newPrime)):
        newPrime += 1
    return newPrime

p = i = 1
for i in range (1, 10002):
    p = NextPrime (p)

print (i, p)