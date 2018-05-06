#The prime factors of 13195 are 5, 7, 13 and 29.
#What is the largest prime factor of the number 600851475143?¨

#Answer: 6857

n = 600851475143
i = 2

def IsPrime (number):
    for i in range(2, number):
        if (number % i == 0):
            return False
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