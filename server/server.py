from datetime import date, datetime
import catboost
from flask import Flask, request
import json
import time
import pandas as pd
import numpy as np
from catboost import CatBoostRegressor
import pymongo
from pymongo import MongoClient

# Server Initialization
app = Flask(__name__)

# Database Connection
cluster = MongoClient(
    "mongodb+srv://CS6242:cityrec@cluster0.idcxs.mongodb.net/Recommendations?retryWrites=true&w=majority")
db = cluster["Recommendations"]


@app.route("/results", methods=['POST'])
def results():
    inputs = request.get_json(force=True)
    print(inputs)

    df = pd.read_csv("Final Dataset.csv")
    cities = pd.read_csv("City_Data_Processed.csv")

    cities['Voted Republican 2016'] = 1 - cities['Voted Democrat 2016']

    df['Gender Wage Gap'] = 1 - df['Gender Wage Gap']
    cities['Gender Wage Gap'] = 1 - cities['Gender Wage Gap']

    max_diversity = cities['Diversity'].max()
    df['Diversity'] = df['Diversity'] * (10 / max_diversity)
    cities['Diversity'] = cities['Diversity'] * (10 / max_diversity)

    cities = cities.drop(['ID Place', 'White Wage', 'Black Wage', 'Asian Wage',
                          'Pacific Islander Wage', 'Other Wage', 'Multiracial Wage',
                          'American/Alaskan Native Wage', 'Unnamed: 0'], axis=1)

    cities = cities.rename(columns={'Household Income': 'Average Household Income',
                                    'Household Ownership': 'Homeownership Percentage',
                                    'Num Universities': 'Number of Colleges and Universities',
                                    'Diversity': 'Diversity Score (0 to 10)',
                                    'Take Public Transit': 'Take Public Transit to Work',
                                    'Walks or Bikes': 'Walk or Bike to Work',
                                    'Access To Exercise Opportunities': 'Have Access to Exercise Facilities',
                                    'Violent Crime': 'Violent Crimes per 100K'})

    df = df.rename(columns={'Household Income': 'Average Household Income',
                            'Household Ownership': 'Homeownership Percentage',
                            'Num Universities': 'Number of Colleges and Universities',
                            'Diversity': 'Diversity Score (0 to 10)',
                            'Take Public Transit': 'Take Public Transit to Work',
                            'Walks or Bikes': 'Walk or Bike to Work',
                            'Access To Exercise Opportunities': 'Have Access to Exercise Facilities',
                            'Violent Crime': 'Violent Crimes per 100K'})

    ytrain = df["MENTHLTH"]
    Xtrain = df.drop("MENTHLTH", axis=1)
    # ****************
    # ****************
    # inputs = response ##response is a server response with user inputs, as json
    # ****************
    # ****************

    city_pol = int(inputs['city_political'])
    if city_pol > 0:
        city_pol_pref = inputs['user_political']
        if city_pol_pref == "Democratic":
            city_demo = city_pol
            city_rep = 0
        else:
            city_rep = city_pol
            city_demo = 0

    cat = CatBoostRegressor(loss_function="RMSE",
                            feature_weights={"Population": inputs['city_pop'],
                                             "Median Age": inputs['city_median_age'],
                                             "Property Value": inputs['city_property_value'],
                                             "Average Household Income": inputs['city_household_income'],
                                             "Homeownership Percentage": inputs['city_household_ownership'],
                                             "Percent Business & Tech Jobs": inputs['city_biz_tech'],
                                             "Number of Colleges and Universities": inputs['city_universities'],
                                             "Diversity Score (0 to 10)": inputs['city_diversity'],
                                             "Gender Wage Gap": inputs['city_gender_wage_gap'],
                                             "Average Wage": inputs['city_avg_wage_gap'],
                                             "Take Public Transit to Work": inputs['city_public_transit'],
                                             "Walk or Bike to Work": inputs['city_walk_bike'],
                                             "Work From Home": inputs['city_wfh'],
                                             "Have Access to Exercise Facilities": inputs['city_exercise'],
                                             "Violent Crimes per 100K": inputs['city_crime'],
                                             "Voted Democrat 2016": city_demo,
                                             "Voted Republican 2016": city_rep})
    cat.fit(Xtrain, ytrain)

    if inputs['gender'] == "Female":
        FEMALE = 1
    else:
        FEMALE = 0

    WHITE = 0
    BLACK = 0
    NATIVE_AMERICAN = 0
    ASIAN = 0
    PACIFIC_ISLANDER = 0
    MULTIRACIAL = 0
    HISPANIC = 0
    OTHER = 0
    if inputs['race'] == "White":
        WHITE = 1
    elif inputs['race'] == "Black":
        BLACK = 1
    elif inputs['race'] == "American/Alaskan Native":
        NATIVE_AMERICAN = 1
    elif inputs['race'] == "Asian":
        ASIAN = 1
    elif inputs['race'] == "Pacific Islander/ Hawaiian Native":
        PACIFIC_ISLANDER = 1
    elif inputs['race'] == "Multiracial":
        MULTIRACIAL = 1
    elif inputs['race'] == "Hispanic":
        HISPANIC = 1
    else:
        OTHER = 1

    if inputs['marital'] == "Married":
        MARRIED = 1
    else:
        MARRIED = 0

    COLLEGE = 0
    HIGH_SCHOOL = 0
    if inputs['education'] == "High School / GED":
        HIGH_SCHOOL = 1
    else:
        COLLEGE = 1

    STUDENT = 0
    SELF_EMPLOYED = 0
    UNEMPLOYED = 0
    NOT_LOOKING = 0
    EMPLOYED = 0
    if inputs['employment'] == "Student":
        STUDENT = 1
    elif inputs['employment'] == "Self-Employed":
        SELF_EMPLOYED = 1
    elif inputs['employment'] == "Employed":
        EMPLOYED = 1
    elif inputs['employment'] == "Unemployed":
        UNEMPLOYED = 1
    else:
        NOT_LOOKING = 1

    THIRTYFIVE = 0
    SEVENTYFIVE = 0
    if inputs['income'] == "$35,000 - $75,000":
        THIRTYFIVE = 1
    else:
        SEVENTYFIVE = 1

    age = int(inputs['age'])
    child = int(inputs['children'])

    d = {'_AGE80': age, 'CHILDREN': child, 'FEMALE': FEMALE, 'WHITE': WHITE, 'BLACK': BLACK, 'NATIVE_AMERICAN': NATIVE_AMERICAN,
         'ASIAN': ASIAN, 'PACIFIC_ISLANDER': PACIFIC_ISLANDER, 'OTHER': OTHER, 'MULTIRACIAL': MULTIRACIAL, 'HISPANIC': HISPANIC,
         'MARRIED': MARRIED, 'HIGH_SCHOOL': HIGH_SCHOOL, 'COLLEGE': COLLEGE, 'EMPLOYED': EMPLOYED, 'SELF_EMPLOYED': SELF_EMPLOYED,
         'UNEMPLOYED': UNEMPLOYED, 'NOT_LOOKING': NOT_LOOKING, 'STUDENT': STUDENT, '35-75K': THIRTYFIVE, '>75K': SEVENTYFIVE}

    demographic_features = pd.DataFrame(data=d, index=list(range(627)))
    X_pred = pd.concat([demographic_features, cities], axis=1)
    X_pred = X_pred.drop(['Place', 'LATITUDE', 'LONGITUDE'], axis=1)

    y_pred = cat.predict(X_pred)
    ind = np.argsort(y_pred)
    top_cities = ind[:10]

    recommendations = cities[[
        'Place', 'LATITUDE', 'LONGITUDE']].iloc[top_cities]
    print(recommendations)
    shap_values = cat.get_feature_importance(
        catboost.Pool(X_pred, label=y_pred), type="ShapValues")
    top_shap_values = shap_values[top_cities]
    feature_importance = [top_shap_values[i][21:37]
                          for i in range(len(top_shap_values))]

    top_city_names = recommendations['Place'].tolist()
    lat = recommendations['LATITUDE'].tolist()
    long = recommendations['LONGITUDE'].tolist()

    top_features = []
    for i in feature_importance:
        sorted_features = np.argsort(i)
        sorted_features += 21
        top_features.append(sorted_features[:5])

    feature_names = X_pred.columns.tolist()
    top_feature_names = []
    for city in top_features:
        top_features_city = []
        for feature in city:
            top_features_city.append(feature_names[feature])
        top_feature_names.append(top_features_city)

    top_feature_values = []
    for i in range(10):
        feature_values_city = []
        for j in range(5):
            city = top_city_names[i]
            feature = top_feature_names[i][j]
            feature_val = float(cities.loc[cities['Place']
                                           == city, feature].values[0])
            if feature in ['Homeownership Percentage', 'Percent Business & Tech Jobs',
                           'Gender Wage Gap', 'Take Public Transit to Work', 'Walk or Bike to Work',
                           'Work From Home', 'Have Access to Exercise Facilities', 'Voted Democrat in 2016']:
                feature_val = str(round(feature_val * 100, 1)) + '%'
            if feature == 'Number of Colleges and Universities':
                feature_val = int(feature_val)
            if feature == 'Diversity Score (0 to 10)':
                feature_val = round(feature_val, 1)
            if feature == 'Average Wage' or feature == 'Violent Crimes per 100K':
                feature_val = int(feature_val)
            feature_values_city.append(feature_val)
        top_feature_values.append(feature_values_city)

    feature_contributions = []
    for i in top_city_names:
        index = cities[cities['Place'] == i].index.values[0]
        city_features_total = sum(np.abs(shap_values[index][21:37]))
        city_feature_contributions = [round(
            (float(shap_values[index][j] / city_features_total) * -100), 1) for j in range(21, 37)]
        feature_contributions.append(city_feature_contributions)

    result = {}
    result['Cities'] = top_city_names
    result['Lat'] = lat
    result['Long'] = long
    result['Top_Features'] = top_feature_names
    result['Top_Feature_Vals'] = top_feature_values
    result['All_City_Feature_Names'] = feature_names[21:37]
    result['Prediction_Contribution_Percentages'] = feature_contributions
    # time.sleep(10)
    # print(inputs)

    # return {"lat": 47.6062, "lon": -122.3321}
    output = []
    for i in range(len(result['Cities'])):
        output.append({
            'City': result['Cities'][i],
            'Lat': result['Lat'][i],
            'Lon': result['Long'][i],
            'Features': result['Top_Features'][i],
            'Values': result['Top_Feature_Vals'][i],
            'AllFeatures': result['All_City_Feature_Names'],
            'FeatureContributions': result['Prediction_Contribution_Percentages'][i]
        })

    city_state = []
    for i in range(len(result['Cities'])):
        split = result['Cities'][i].split(",")
        split[1] = split[1].strip(" ")
        city_state.append(split)
    cities = pd.DataFrame(city_state, columns=['City', 'State'])
    cities.to_csv('results.csv', index=False, mode='a', header=False)

    db["UserRecs"].insert_one({
        "time": datetime.now(),
        "results": output
    })

    return json.dumps(output)


if __name__ == "__main__":
    app.run(debug=True)
