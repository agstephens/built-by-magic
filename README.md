# built-by-magic

**Live Application URL:** https://builtbymagic.netlify.app/

A Node.js starter project configured for automated AI development, providing mathematical, creative, and textual utility functions alongside an automated testing suite and web interface.

## App Functions & Features

The application features four main functions accessible via both Node.js exports and the web interface (`public/index.html`):

1. **Exponential Calculator (`calculatePower`)**
   - Calculates mathematical powers ($base^{exponent}$) supporting positive, negative, zero, and fractional exponents.
   - Includes input validation to ensure valid finite numbers.

2. **Circle Area Calculator (`calculateCircleArea`)**
   - Computes the geometric area of a circle ($\pi r^2$) for any non-negative radius.
   - Throws descriptive errors for negative or non-numeric inputs.

3. **Colour Art Generator**
   - Generates generative canvas artwork by blending user-selected color palettes with randomized geometric shapes, circles, polygons, and ribbons.

4. **Jane Austen Writer (`generateAustenText`)**
   - Generates paragraphs (approximately 5 sentences long) in the style of Jane Austen using N-gram language modeling (bigrams, trigrams, tetragrams).
   - Automatically downloads and caches the full source text of *Pride and Prejudice* from Project Gutenberg (`https://www.gutenberg.org/files/1342/1342-0.txt`).
   - Caches tokenized text and N-gram frequency models for fast response times.

Additionally, the app includes a **Preferences & Settings** panel allowing users to customize themes (Light, Dark, Ocean Blue, Forest Green), decimal precision formatting, and startup tabs.

## Frontend Screenshots

Here is the application front end in action:

### Initial View
![Calculator Initial View](assets/screenshots/app_initial.png)

### Calculation Result
![Calculator Result View](assets/screenshots/app_result.png)

## Requirements

- Node.js (v18 or higher recommended)
- npm

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd built-by-magic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

You can import and use utilities from `src/index.js`:

```javascript
const {
  calculatePower,
  calculateCircleArea,
  generateAustenText
} = require('./src/index');

// 1. Exponential calculation
console.log(calculatePower(2, 3)); // Outputs: 8

// 2. Circle area calculation
console.log(calculateCircleArea(5)); // Outputs: 78.5398...

// 3. Jane Austen Writer paragraph generation
async function demoAusten() {
  const paragraph = await generateAustenText('trigram', 5);
  console.log(paragraph);
}
demoAusten();
```

## Available Scripts

- `npm test`: Runs the Jest test suite.

## Testing

Unit tests are located in the `tests/` directory and use [Jest](https://jestjs.io/).

To execute the tests:

```bash
npm test
```

The test suite verifies:
- Exponential calculation operations and error handling (`tests/index.test.js`)
- Circle area calculations and boundary checks (`tests/index.test.js`)
- Preferences and settings validation utilities (`tests/settings.test.js`)
- Jane Austen Writer tokenization, N-gram model construction, parameter validation, and text generation (`tests/austenWriter.test.js`)

## CI/CD Workflow

GitHub Actions runs automated test checks on every `push` and `pull_request` targeting the `main` branch. The workflow installs dependencies and runs `npm test` across Node.js versions 18, 20, and 22.

## Deployment to Netlify

Automated deployments to Netlify are handled by the GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Environment & Configuration

- **Environment:** The deployment job runs under the GitHub Environment named `Deployment CI` (`environment: "Deployment CI"`).
- **Viewing Environment & Secrets:** You can view and configure the deployment environment, its protection rules, and secrets in GitHub under **Settings > Environments > Deployment CI** (or **Settings > Secrets and variables > Actions** for repository secrets).

### How It Works

- **Trigger:** On every `push` to the `main` branch.
- **Process:** The workflow checks out the repository, sets up Node.js, installs dependencies, runs the test suite (`npm test`), and deploys the web application assets in the `public/` directory directly to production on Netlify using Netlify CLI.

### Required Secrets

To enable Netlify deployment in your repository, configure the following secrets in **Settings > Environments > Deployment CI** (or repository secrets in **Settings > Secrets and variables > Actions**):

- `NETLIFY_AUTH_TOKEN`: Personal access token generated from your Netlify account settings (User Settings > Applications > Personal Access Tokens).
- `NETLIFY_SITE_ID`: The API ID of your Netlify site (Site Settings > General > Site Details > API ID).
