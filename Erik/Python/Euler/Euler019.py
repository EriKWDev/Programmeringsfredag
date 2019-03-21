#How many Sundays fell on the first of the month during the twentieth century (1 Jan 1901 to 31 Dec 2000)?

#Answer: 171

import datetime
from datetime import timedelta

startDate = datetime.datetime (1901, 1, 1)
endDate = datetime.datetime (2000, 12, 31)

dayCount = (endDate - startDate).days + 1

n = 0
for tmpDate in (startDate + timedelta(n) for n in range (dayCount)):
    if tmpDate.weekday () == 6 and tmpDate.day == 1:
        n += 1

print (n)
