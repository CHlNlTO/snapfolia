# React App Deployment on CentOS

This guide provides step-by-step instructions to deploy a React application on a CentOS server using WinSCP for file transfer and PuTTY for server management.

## Steps to Deploy Your React App

### 1. Transfer React Files to the Server

1. Open **WinSCP**.
2. Connect to your CentOS server using the server’s IP address and your credentials.
3. Drag and drop your React application files into the desired directory on the server.

### 2. Connect to the Server with PuTTY

1. Open **PuTTY**.
2. Connect to your CentOS server using the server’s IP address and your credentials (username and password or SSH key).

### 3. Install Node.js and npm

1. In the PuTTY terminal, execute the following commands to install Node.js and npm:

    ```bash
    sudo yum install epel-release
    curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
    sudo yum install nodejs
    ```

2. Verify the installation:

    ```bash
    node -v
    npm -v
    ```

### 4. Navigate to Your React App Directory

1. Use PuTTY to navigate to the directory where you uploaded your React app using WinSCP:

    ```
    [root@trees /]# cd var
    [root@trees var]# cd www
    [root@trees www]# cd html
    [root@trees html]# cd client
    [root@trees client]# cd snapfolia_v3
    [root@trees snapfolia_v3]# serve -s build
    ```

    ```bash
    cd /path/to/your/react-app
    ```

### 5. Install Dependencies

1. Install the required dependencies for your React app:

    ```bash
    npm install
    ```

### 6. Build the React App

1. Build the production version of your React app:

    ```bash
    npm run build
    ```

### 7. Serve the React App on Port 3000

1. Install the `serve` package globally:

    ```bash
    npm install -g serve
    ```

2. Serve your React app on port 3000:

    ```bash
    serve -s build -l 3000
    ```

3. Your app should now be accessible via `http://your-server-ip:3000/`. If you have a domain name configured, you can access it via `http://trees.firstasia.edu.ph:3000/`.

## Summary

- **WinSCP** is used for transferring files to the server.
- **PuTTY** is used to execute commands and manage your server.
- Follow the above steps to deploy your React application and serve it on port 3000.

For more details, refer to the documentation for [React](https://reactjs.org/docs/getting-started.html), [Node.js](https://nodejs.org/en/docs/), and [CentOS](https://www.centos.org/docs/).

