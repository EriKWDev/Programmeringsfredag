#Let d(n) be defined as the sum of proper divisors of n (numbers less than n which divide evenly into n).
#If d(a) = b and d(b) = a, where a is not equal to b, then a and b are an amicable pair and each of a and b are called amicable numbers.
#Evaluate the sum of all the amicable numbers under 10000.

#Answer:

def PrimeFactors (n):
    i = 1
    pf = []
    while (n > 1):
        if (n % i == 0):
            n = n / i
            pf [i] += 1
            if (i == 1):
                i = 2
        else:
            i += 1
    return pf

def AllCombinations(n):
    return 0

print PrimeFactors (12)
