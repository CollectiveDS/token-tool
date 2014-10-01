## Install
```
git clone git@github.com:CollectiveDS/token-tool.git
npm install
```

## Run
```
# need to run as sudo b/c app listens on port 443
sudo npm start
```

## Use
Make sure you have https://localhost setup as a valid redirect URI in your oauth application settings
Visit [https://localhost](https://localhost)

1. Fill out the form with the required service parameters and your application details
2. Click "Save Credentials" if you want to store those credentials for reuse
3. Click "Get Access Token" to request access and refresh tokens. The credentials will auto download to a file named *servicedomain*-credentials.json.
