# Snapfolia

Welcome to the Snapfolia repository! Snapfolia is a leaf classifier web application using a machine-learning model.

## Collaborator Roles and Branch Permissions

### Branches Overview

- **main**: Production-ready code base.
- **staging**: Development stage for testing new features.
- **develop**: Ongoing development branch.
- **web**: Branch for web application development.
- **model**: Branch for machine-learning model development.

### Collaborator Roles and Permissions

Each collaborator has specific roles assigned for contributing to the Snapfolia project. They are restricted to push changes only to their assigned branches to maintain code integrity and project organization.

#### Role Assignments

- **Model Branch Collaborators**:
  - Responsible for the `model` folder within the `model` branch.
  - Only authorized to edit, push, and make changes to the `model` folder.
  - All changes related to the machine-learning model should be made within this branch.

- **Web Branch Collaborators**:
  - Responsible for the `web` branch.
  - Only authorized to push and make changes to the web application.
  - Tasks include frontend, backend, and integration tasks specific to the web interface.

### Collaborator Responsibilities

- **Pull Requests**: Create pull requests from your assigned branch (`model`, `web`) to the respective target branch (`main`, `staging`, `develop`) for code review and merging.
- **Review Process**: All changes must undergo review by at least one other collaborator before merging.
- **Code Quality**: Ensure code quality, documentation, and adherence to coding standards before submitting pull requests.

## Getting Started

To contribute to Snapfolia, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
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
6. Create a pull request:
- Navigate to the repository on GitHub.
- Select your branch and click "Compare & pull request".
- Provide a brief summary of your changes and submit the pull request for review.
7. Collaborate and iterate: Discuss and address feedback received during the review process. Once approved, changes will be merged into the target branch (**main**, **staging**, **develop**).

## Getting Started
- For any questions or assistance, contact the project lead or fellow collaborators.
- Adhere to project guidelines and coding standards to maintain consistency and quality across Snapfolia.
