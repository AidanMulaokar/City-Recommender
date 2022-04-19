#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Apr 19 18:52:19 2022

@author: jacobswain
"""
import pandas as pd
import numpy as np
from catboost import CatBoostRegressor

df = pd.read_csv("Final Dataset.csv")
cities = pd.read_csv("City_Data_Processed.csv")

ytrain = df["MENTHLTH"]
Xtrain = df.drop("MENTHLTH", axis=1)

inputs = json.load(response) ##response is a server response with user inputs, as json
city_pol = inputs[15]
if city_pol > 0:
    city_pol_pref = inputs[16]
    if city_pol_pref == "Democrat":
        city_demo = city_pol
        city_rep = 0
    else:
        city_rep = city_pol
        city_demo = 0

cat = CatBoostRegressor(loss_function="RMSE",
                        feature_inputs = {"Population" : inputs[0],
                                           "Median Age" : inputs[1],
                                           "Property Value" : inputs[2],
                                           "Household Income" : inputs[3],
                                           "Household Ownership" : inputs[4],
                                           "Percent Business & Tech Jobs" : inputs[5],
                                           "Num Universities" : inputs[6],
                                           "Diversity" : inputs[7],
                                           "Gender Wage Gap" : inputs[8],
                                           "Average Wage" : inputs[9],
                                           "Take Public Transit" : inputs[10],
                                           "Walks or Bikes" : inputs[11],
                                           "Work From Home" : inputs[12],
                                           "Access To Exercise Opportunities" : inputs[13],
                                           "Violent Crime" : inputs[14],
                                           "Voted Democrat 2016" : city_demo,
                                           "Voted Republican 2016" : city_rep})
cat.fit(Xtrain, ytrain)

demographic_features = pd.DataFrame(inputs, columns = ['age', 'gender', 'race', 'marital', 
                                                 'children', 'education', 'employment', 'income'])
demographic_features['key'] = 1
cities['key'] = 1
X_pred = demographic_features.merge(cities, on='key').drop("key", 1)
y_pred = cat.predict(X_pred)


