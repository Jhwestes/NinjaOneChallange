# NinjaOneChallange
These tests are built on [Testcafe](https://devexpress.github.io/testcafe/documentation/getting-started/),
a node.js tool to automate end-to-end web testing.

Please use the following [page model](https://devexpress.github.io/testcafe/documentation/recipes/use-page-model.html)
when creating new tests.

## Install the Project Dependencies
```bash
npm install
```

## Running Tests

To list available browsers:
```bash
testcafe --list-browsers
```

To run tests, run the following:
```bash
testcafe chrome webdriver/suites --env=<qa/staging/production>

testcafe "chrome:headless webdriver/suites" --env=<qa/staging/production> <path to file>
```

Useful flags:

**--autoplay-policy=no-user-gesture-required** 

sets the `chrome://flags/#autoplay-policy` flag to no-user-gesture-required

**--selector-timeout 60000** 

sets the timeout limit to 60s. This flag is useful when the page load is too slow

**-L** 

run test in live mode

**-q** 

run test in quarantineMode.

A test runs at the first time. If it passes, TestCafe proceeds to the next test.
If the test fails, it runs again until it passes or fails three times.

**Example:**

```bash
testcafe "chrome --autoplay-policy=no-user-gesture-required" <path to file> -L --selector-timeout 50000
```

## Maintainers

The lead maintainers on this project is:

- Luis Francisco Dominguez Jhwestes