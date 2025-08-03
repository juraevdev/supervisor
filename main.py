# def add(*args):
#     total = 0
#     for arg in args:
#         total =+ arg
#     return total

# print(add(1))


# def my_kwargs(**kwargs):
#     for key, value in kwargs.items():
#         print(f"{key}: {value}")

#     if "davlat" in kwargs:
#         print(f"{kwargs.get('davlat')}  {kwargs.get('shahar')}")

#     else:
#         print(f"{kwargs.get('shahar')} {kwargs.get('tuman')} {kwargs.get('mahalla')}")

# my_kwargs(davlat="Uzbekiston", shahar="Jizzax", tuman="Sharof Rashidov", mahalla="Olmachi", kocha="Nasaf", uy=27) 


# mylist = [1, 2, 3, 4, 1, 1, 1, 1]
# print(mylist.count(2))
# my_list = ['davlat', 'juraev']
# print(my_list)
# my_list.append('ilxomovich')
# print(my_list)
# my_list.pop(2)
# print(my_list)
# my_list.reverse()
# print(my_list)
# my_list.sort()
# print(my_list)


# savat = []
# fruits = ['olma', 'uzum', 'anor', 'banan', 'orik']
# for fruit in fruits:
#     total = 0
#     fruit = input('nima xarid qilasiz?: ')
#     if fruit in fruits:
#         savat.append(fruit)
#         print('Xarid uchun rahmat')
#     else: 
#         print('Bunday meva mavjud emas')
#         continue
#     user = input('Yana biron nima xarid qilasizmi?: xa/yo\'q: ')
#     if user == 'xa':
#         continue
#     else: 
#         break
# print(savat)


def my_wrapper(func):
    def wrapper():
        print('Salom, mening ismim Davlat')
        func()
        print('Yoshim 19 da')
        print('Python dasturlash tilini o\'rganyapman')
    return wrapper

@my_wrapper
def salom():
    print('Familiyam Juraev')

salom()

