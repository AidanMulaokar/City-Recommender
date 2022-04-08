#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar 22 14:24:46 2022

@author: jacobswain
"""
import json
import pandas as pd

def get_city_name (element):
    """
    Takes a metropolitan statistical area designation and extracts the name of the the primary city
    """
    split = (str(element)).split(',')
    city = split[0].replace('b\'', "")
    state = split[1]
    city = city.split('-')[0]
    state = state.split('-')[0]
    city_name = city + ',' + state
    return city_name

def parse_cdc_data (cdc_file):
    df = pd.read_sas(cdc_file)
    df = df[['_AGE80', '_SEX', '_RACE', 'MARITAL', '_EDUCAG', 'EMPLOY1', 'CHILDREN', 'INCOME2', 'MENTHLTH', 'MMSANAME']]
    df = df.dropna()
    #One-hot encoding of categorical features and drop NAs or non-responses
    df['FEMALE'] = df['_SEX'] - 1
    df.drop(['_SEX'], axis = 1, inplace = True)
    df['WHITE'] = 1 * (df['_RACE'] == 1)
    df['BLACK'] = 1 * (df['_RACE'] == 2)
    df['NATIVE_AMERICAN'] = 1 * (df['_RACE'] == 3)
    df['ASIAN'] = 1 * (df['_RACE'] == 4)
    df['PACIFIC_ISLANDER'] = 1 * (df['_RACE'] == 5)
    df['OTHER'] = 1 * (df['_RACE'] == 6)
    df['MULTIRACIAL'] = 1 * (df['_RACE'] == 7)
    df['HISPANIC'] = 1 * (df['_RACE'] == 8)
    df.drop(df[df['_RACE'] == 9].index, inplace = True)
    df.drop(['_RACE'], axis = 1, inplace = True)
    df['MARRIED'] = 1 * (df['MARITAL'] == 1)
    df['UNMARRIED'] = 1 * (df['MARITAL'] != 1)
    df.drop(['MARITAL'], axis = 1,  inplace = True)
    df['NO_HIGH_SCHOOL'] = 1 * (df['_EDUCAG'] == 1)
    df['HIGH_SCHOOL'] = 1 * ((df['_EDUCAG'] == 2) | (df['_EDUCAG'] == 3))
    df['COLLEGE'] = 1 * (df['_EDUCAG'] == 4)
    df.drop(df[df['_EDUCAG'] == 9].index, inplace = True)
    df.drop(['_EDUCAG'], axis = 1, inplace = True)
    df['EMPLOYED'] = 1 * (df['EMPLOY1'] == 1)
    df['SELF_EMPLOYED'] = 1 * (df['EMPLOY1'] == 2)
    df['UNEMPLOYED'] = 1 * ((df['EMPLOY1'] == 3) | (df['EMPLOY1'] == 4))
    df['NOT_LOOKING'] = 1 * ((df['EMPLOY1'] == 5) | (df['EMPLOY1'] == 7) | (df['EMPLOY1'] == 8))
    df['STUDENT'] = 1 * (df['EMPLOY1'] == 6)
    df.drop(df[df['EMPLOY1'] == 9].index, inplace = True)
    df.drop(['EMPLOY1'], axis = 1, inplace = True)
    df.loc[df['CHILDREN'] == 88, 'CHILDREN'] = 0
    df.drop(df[df['CHILDREN'] == 99].index, inplace = True)
    df.drop(df[df['INCOME2'] == 77].index, inplace = True)
    df.drop(df[df['INCOME2'] == 99].index, inplace = True)
    df['<35K'] = 1 * (df['INCOME2'] <= 5.0)
    df['35-75K'] = 1 * ((df['INCOME2'] == 6.0) | (df['INCOME2'] == 7.0))
    df['>75K'] = 1 * (df['INCOME2'] == 8.0)
    df.loc[df['MENTHLTH'] == 88, 'MENTHLTH'] = 0
    df.drop(df[df['MENTHLTH'] == 77].index, inplace = True)
    df.drop(df[df['MENTHLTH'] == 99].index, inplace = True)
    #String manipulation of city names to match city features dataset
    df['MMSANAME'] = df['MMSANAME'].apply(get_city_name)
    return df

def parse_city_data (city_file):
    with open(city_file) as json_file:
        data = json.load(json_file)
    cities = pd.DataFrame(data['data'])
    cities.drop(['Year', 'ID Year', 'Slug Place','Foreign-Born Citizens'], axis=1, inplace=True)
    cities['Household Ownership'] = cities['Household Ownership'] / cities['Population']
    cities['Health Insurance Policies'] = cities['Health Insurance Policies'] / cities['Population']
    return cities

cdc_file = 'CDC_Data_XPT.xpt'
city_file = 'city_data.json'
cdc_data = parse_cdc_data(cdc_file)
city_data = parse_city_data(city_file)
cdc_data.to_csv('CDC_Data_Processed')
city_data.to_csv('City_Data_Processed')

