#A palindromic number reads the same both ways. The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.
#Find the largest palindrome made from the product of two 3-digit numbers.

#Answer: 906609

def IsPalindrome (number):
    numberStr = str (number)
    numberLen = len (numberStr)
    for i in range (0, len (numberStr)):
        if (numberStr[i] != numberStr[numberLen-i-1]):
            return False
    return True

largestPal = 0

for a in range (100, 1000):
    for b in range (100, 1000):
        n = a * b
        if (IsPalindrome (n) and n > largestPal):
            largestPal = n

print (largestPal)