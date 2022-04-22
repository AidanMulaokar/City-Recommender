import catboost
from flask import Flask, request
import json
import time
import pandas as pd
import numpy as np
from catboost import CatBoostRegressor


app = Flask(__name__)


@app.route("/results", methods=['POST'])
def results():
    inputs = request.get_json(force=True)
    df = pd.read_csv("Final Dataset.csv")
    cities = pd.read_csv("City_Data_Processed.csv")
    cities['Voted Republican 2016'] = 1 - cities['Voted Democrat 2016']
    cities = cities.drop(['ID Place', 'White Wage', 'Black Wage', 'Asian Wage',
                          'Pacific Islander Wage', 'Other Wage', 'Multiracial Wage',
                          'American/Alaskan Native Wage', 'Unnamed: 0'], axis=1)

    ytrain = df["MENTHLTH"]
    Xtrain = df.drop("MENTHLTH", axis=1)

    # inputs = {'city_pop': 1,
    #           'city_median_age': 1,
    #           'city_property_value': 1,
    #           'city_household_income': 1,
    #           'city_household_ownership': 1,
    #           'city_biz_tech': 1,
    #           'city_universities': 1,
    #           'city_diversity': 1,
    #           'city_gender_wage_gap': 1,
    #           'city_avg_wage_gap': 1,
    #           'city_public_transit': 1,
    #           'city_walk_bike': 1,
    #           'city_wfh': 1,
    #           'city_exercise': 1,
    #           'city_crime': 1,
    #           'city_political': 1,
    #           'user_political': 'Democratic',
    #           'age': 26,
    #           'gender': 'Male',
    #           'race': 'White',
    #           'marital': 'Unmarried',
    #           'children': 0,
    #           'education': '2-4 Year College Degree',
    #           'employment': 'Student',
    #           'income': 'Less than $75,000'
    #           }

    city_pol = inputs['city_political']
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
                                             "Household Income": inputs['city_household_income'],
                                             "Household Ownership": inputs['city_household_ownership'],
                                             "Percent Business & Tech Jobs": inputs['city_biz_tech'],
                                             "Num Universities": inputs['city_universities'],
                                             "Diversity": inputs['city_diversity'],
                                             "Gender Wage Gap": inputs['city_gender_wage_gap'],
                                             "Average Wage": inputs['city_avg_wage_gap'],
                                             "Take Public Transit": inputs['city_public_transit'],
                                             "Walks or Bikes": inputs['city_walk_bike'],
                                             "Work From Home": inputs['city_wfh'],
                                             "Access To Exercise Opportunities": inputs['city_exercise'],
                                             "Violent Crime": inputs['city_crime'],
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

    age = inputs['age']
    child = inputs['children']

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

    shap_values = cat.get_feature_importance(
        catboost.Pool(X_pred, label=y_pred), type="ShapValues")
    feature_importance = shap_values[top_cities]

    top_features = []
    for i in feature_importance:
        sorted_features = np.argsort(i)
        top_features.append(sorted_features[:5])

    feature_names = X_pred.columns.tolist()
    top_feature_names = []
    for city in top_features:
        top_features_city = []
        for feature in city:
            top_features_city.append(feature_names[feature])
        top_feature_names.append(top_features_city)

    '''    
    top_feature_values = []
    for i in range(10):
        feature_values_city = []
        for j in range(5):
            feature_val = cities.loc[cities['Place'] == i][j]
            feature_values_city.append(feature_val)
        top_feature_values.append(feature_values_city)    
    '''

    result = {}
    result['Cities'] = recommendations['Place'].tolist()
    result['Lat'] = recommendations['LATITUDE'].tolist()
    result['Long'] = recommendations['LONGITUDE'].tolist()
    result['Top_Features'] = top_feature_names
    # time.sleep(10)
    # print(inputs)

    # return {"lat": 47.6062, "lon": -122.3321}
    output = []
    for i in range(len(result['Cities'])):
        output.append({
            'City': result['Cities'][i],
            'Lat': result['Lat'][i],
            'Lon': result['Long'][i],
            'Features': result['Top_Features'][i]})
    return json.dumps(output)


if __name__ == "__main__":
    app.run(debug=True)
