import pandas as pd 
from sklearn.preprocessing import OneHotEncoder

disease_data = pd.read_csv("dataset.csv")
clean1 = disease_data.drop(['Symptom_15', 'Symptom_16', 'Symptom_17'], axis = 1)

object_cols = ['Symptom_1', 'Symptom_2', 'Symptom_3', 'Symptom_4', 'Symptom_5', 'Symptom_6', 'Symptom_7', 'Symptom_8',
               'Symptom_9', 'Symptom_10', 'Symptom_11', 'Symptom_12', 'Symptom_13', 'Symptom_14']

# Apply one-hot encoder to each column with categorical data
OH_encoder = OneHotEncoder(handle_unknown='ignore', sparse=False)
OH_cols = pd.DataFrame(OH_encoder.fit_transform(clean1[object_cols]))

OH_cols.index = clean1.index
OH_cols.columns = OH_encoder.get_feature_names()

target_col = clean1.drop(object_cols, axis = 1)
OH_cols['Diseases'] = target_col
OH_cols.drop(['x13_nan'], axis = 1)
OH_cols.to_csv("encoded.csv", index = False)
