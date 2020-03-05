[![New Relic One Catalog Project header](https://github.com/newrelic/open-source-office/raw/master/examples/categories/images/New_Relic_One_Catalog_Project.png)](https://github.com/newrelic/open-source-office/blob/master/examples/categories/index.md#nr1-catalog)

# PageView Map (nr1-pageview-map)

![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/newrelic/nr1-pageview-map?include_prereleases&sort=semver) ![AppVeyor](https://img.shields.io/appveyor/ci/newrelic/nr1-pageview-map) [![Snyk](https://snyk.io/test/github/newrelic/nr1-pageview-map/badge.svg)](https://snyk.io/test/github/newrelic/nr1-pageview-map)[![CircleCI](https://circleci.com/gh/newrelic/nr1-pageview-map.svg?style=svg)](https://circleci.com/gh/newrelic/nr1-pageview-map)

## Usage

PageView Map uses [`Browser`](https://newrelic.com/products/browser-monitoring) data to plot activity on a map visualization, allowing you to do geographic exploration of your data.

![Screenshot #1](https://github.com/newrelic/nr1-pageview-map/raw/master/catalog/screenshots/screenshot_01.png)

## Open Source License

This project is distributed under the [Apache 2 license](https://github.com/newrelic/nr1-pageview-map/blob/master/LICENSE).

## Dependencies

[`New Relic Browser`](https://newrelic.com/products/browser-monitoring).

## Getting started

First, ensure that you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [NPM](https://www.npmjs.com/get-npm) installed. If you're unsure whether you have one or both of them installed, run the following command(s) (If you have them installed these commands will return a version number, if not, the commands won't be recognized):

```bash
git --version
npm -v
```

Next, clone this repository and run the following scripts:

```bash
nr1 nerdpack:clone -r https://github.com/newrelic/nr1-pageview-map.git
cd nr1-pageview-map
npm start
```

Visit [https://one.newrelic.com/?nerdpacks=local](https://one.newrelic.com/?nerdpacks=local), navigate to the Nerdpack via Entity Explorer > choose a Browser application > click on PageView Map in the left hand navigation, and :sparkles:

## Deploying this Nerdpack

Open a command prompt in the nerdpack's directory and run the following commands.

```bash
# To create a new uuid for the nerdpack so that you can deploy it to your account:
# nr1 nerdpack:uuid -g [--profile=your_profile_name]

# To see a list of APIkeys / profiles available in your development environment:
# nr1 credentials:list

nr1 nerdpack:publish [--profile=your_profile_name]
nr1 nerdpack:deploy [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
nr1 nerdpack:subscribe [-c [DEV|BETA|STABLE]] [--profile=your_profile_name]
```

Visit [https://one.newrelic.com](https://one.newrelic.com), navigate to the Nerdpack, and :sparkles:

## Community Support

New Relic hosts and moderates an online forum where you can interact with New Relic employees as well as other customers to get help and share best practices. Like all New Relic open source community projects, there's a related topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

[https://discuss.newrelic.com/t/new-relic-one-page-view-map-nerdpack/87602](https://discuss.newrelic.com/t/new-relic-one-page-view-map-nerdpack/87602)

Please do not report issues with PageView Map to New Relic Global Technical Support. Instead, visit the [`Explorers Hub`](https://discuss.newrelic.com/t/new-relic-one-page-view-map-nerdpack/87602) for troubleshooting and best-practices.

## Issues / Enhancement Requests

Issues and enhancement requests can be submitted in the [Issues tab of this repository](https://github.com/newrelic/nr1-pageview-map/issues). Please search for and review the existing open issues before submitting a new issue.

## Contributing

Contributions are welcome (and if you submit a Enhancement Request, expect to be invited to contribute it yourself :grin:). Please review our [Contributors Guide](https://github.com/newrelic/nr1-pageview-map/blob/master/CONTRIBUTING.md).

Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource+nr1-pageview-map@newrelic.com.
