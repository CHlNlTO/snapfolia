# Snapfolia

Welcome to the Snapfolia repository! Snapfolia is a leaf classifier web application using a machine-learning model.

## Tech Stack

- **Frontend:**
  - HTML
  - CSS
  - JavaScript

- **Backend:**
  - Python 3.9.12

## Collaborator Roles and Branch Permissions

### Branches Overview

- **model**: Branch for machine-learning model development.
- **web**: Branch for web application development.
- **develop**: Merging branch of web and model branches.
- **staging**: Testing stage of the compiled develop branch.
- **main**: Production-ready code base.

### Collaborator Roles and Permissions

Each collaborator has specific roles assigned for contributing to the Snapfolia project. They are restricted to push changes only to their assigned branches to maintain code integrity and project organization.

#### Role Assignments

- **Model Branch Collaborators**:
  - Responsible for the `model` folder within the `model` branch.
  - Must create sub-branch such as `model/<action>` for the `model` branch to make changes.
  - Only authorized to add, delete, edit, and make updates to the `model` folder
  - Only authorized to edit, push, and make changes to the `model/<action>` sub-branch.
  - All changes related to the machine-learning model should be made within this branch.

- **Web Branch Collaborators**:
  - Responsible for the `web` branch.
  - Must create sub-branch such as `web/<action>` for the `web` branch to make changes.
  - Only authorized to add, delete, edit, and make updates to the `web` folder
  - Only authorized to edit, push, and make changes to the `web/<action>` sub-branch.
  - Tasks include frontend, backend, database, and integration tasks specific to the web interface.

### Collaborator Responsibilities

- **Pull Requests**: Create pull requests from your assigned branch (`model/<action>`, `web/<action>`) to the respective target branch (`model`, `web`) for code review and merging.
- **Review Process**: All changes must undergo review by at least one other collaborator before merging.
- **Code Quality**: Ensure code quality, documentation, and adherence to coding standards before submitting pull requests.

## Getting Started

To contribute to Snapfolia, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/CHlNlTO/snapfolia.git
   cd snapfolia
2. Checkout to your assigned branch (model, web):
   ```bash
   git checkout <branch-name>
3. Make changes, add features, or fix bugs within your assigned branch.
4. Commit your changes:
   ```bash
   git add .
   git commit -m "Brief description of changes"
5. Push changes to your assigned branch:
   ```bash
   git push origin <branch-name>
Once approved, changes will be merged into the target branch (develop, staging, main).

## Inquiries
- For any questions or assistance, contact the project lead or fellow collaborators.
- Adhere to project guidelines and coding standards to maintain consistency and quality across Snapfolia.
