import pandas as pd
import json



def load_emails(json_file):
    data = json.load(json_file)  # burada uploaded_file geliyor
    if isinstance(data, list):
        return pd.DataFrame(data)
    elif isinstance(data, dict) and "emails" in data:
        return pd.DataFrame(data["emails"])
    else:
        raise ValueError("Beklenmeyen veri formatı")
