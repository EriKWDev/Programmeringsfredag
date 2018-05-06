#2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.
#What is the smallest positive number that is evenly divisible by all of the numbers from 1 to 20?

#Answer: 232792560

import functools

def GCD (a, b):
    return GCD (b, a%b) if b != 0 else a

def LCM (a, b):
    return int ((a * b) / GCD (a, b))

print (functools.reduce (LCM, range (2, 21)))