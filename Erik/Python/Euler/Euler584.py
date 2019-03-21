#If people on your planet were to enter a very large room one by one,
#what will be the expected number of people in the room when you first
#find 4 people with Birthdays within 7 days from each other?

#What would be the answer (rounded to eight places after the decimal point) the people of Earth
#have to enter into the device for a year with 365 days? Ignore leap years. 
#Also assume that all birthdays are equally likely and independent of each other.

#Answer: 

def ProbabilityOfSameBirthday (days, n, m, margin = 0):
    p = 1
    for i in range (0, m):
        a = (days - (i * (2*margin + 1)))
        p *= a/days
    return 1 - p

def ProbabilityOfSameBirthday2 (days, n, margin = 0):
    return 1 - ((days - ((2 * margin) + 1))/(days))**((n*(n-1))/2)

def ProbabilityOfSameBirthdayNEW (days, n, margin = 0):
    return (((2 * margin) + 1) / days)**(n - 1)

def Factorial (n, n2 = 1):
    p = 1
    while (n > n2):
        p *= n
        n = n - 1
        print (n, p)
    return p

print (ProbabilityOfSameBirthday (10, 1, 3, 1))
