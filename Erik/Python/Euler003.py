#The prime factors of 13195 are 5, 7, 13 and 29.
#What is the largest prime factor of the number 600851475143?¨

#Answer: 6857

n = 600851475143
i = 2

def IsPrime (number):
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
    while (not IsPrime (newPrime)):
        newPrime += 1
    return newPrime

while (n != 1):
    while (n % i == 0):
        n = n / i
        print (i)
    i = NextPrime (i)