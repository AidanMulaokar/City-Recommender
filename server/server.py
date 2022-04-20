from flask import Flask, request
import json
import time
import pandas as pd
import numpy as np
from catboost import CatBoostRegressor


app = Flask(__name__)


@app.route("/results", methods=['POST'])
def results():
    #inputs = request.get_json(force=True)
    df = pd.read_csv("Final Dataset.csv")
    cities = pd.read_csv("City_Data_Processed.csv")

    ytrain = df["MENTHLTH"]
    Xtrain = df.drop("MENTHLTH", axis=1)

    # request is a json object containing information from the UI, as json
    inputs = request.get_json(force=True)
    print(inputs)
    city_pol = inputs["city_political"]
    if city_pol > 0:
        city_pol_pref = inputs["user_political"]
        if city_pol_pref == "Democratic":
            city_demo = city_pol
            city_rep = 0
        else:
            city_rep = city_pol
            city_demo = 0

    cat = CatBoostRegressor(loss_function="RMSE",
                            feature_weights={"Population": inputs["city_pop"],
                                             "Median Age": inputs["city_median_age"],
                                             "Property Value": inputs["city_property_value"],
                                             "Household Income": inputs["city_household_income"],
                                             "Household Ownership": inputs["city_household_ownership"],
                                             "Percent Business & Tech Jobs": inputs["city_biz_tech"],
                                             "Num Universities": inputs["city_universities"],
                                             "Diversity": inputs["city_diversity"],
                                             "Gender Wage Gap": inputs["city_gender_wage_gap"],
                                             "Average Wage": inputs["city_avg_wage_gap"],
                                             "Take Public Transit": inputs["city_public_transit"],
                                             "Walks or Bikes": inputs["city_walk_bike"],
                                             "Work From Home": inputs["city_wfh"],
                                             "Access To Exercise Opportunities": inputs["city_exercise"],
                                             "Violent Crime": inputs["city_crime"],
                                             "Voted Democrat 2016": city_demo,
                                             "Voted Republican 2016": city_rep})
    cat.fit(Xtrain, ytrain)

    demographic_features = pd.DataFrame(inputs, columns=['age', 'gender', 'race', 'marital',
                                                         'children', 'education', 'employment', 'income'])
    demographic_features['key'] = 1
    cities['key'] = 1
    X_pred = demographic_features.merge(cities, on='key').drop("key", 1)
    y_pred = cat.predict(X_pred)
    print(y_pred)
    # time.sleep(10)
    # print(inputs)

    return {"lat": 47.6062, "lon": -122.3321}


if __name__ == "__main__":
    app.run(debug=True)
