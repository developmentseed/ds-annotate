# ds-annotate

Magic wand and Segment Anything Model (SAM2) annotation tool for machine learning training data. 

![370998787-c8532ae9-d073-4381-b466-adfca76d7d381-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/fb5b951e-643a-43b6-b80c-a5e545b6b9db)



**This application consumes a service API from [samgeo-service](https://github.com/GeoCompas/samgeo-service).**

## Installation and Usage
The steps below will walk you through setting up your own instance of the project.

### Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) v16 (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/) Package manager

### Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version: `v16.14.2`

```
nvm install
```

Install Node modules:

```
yarn install
```

## Usage

Ds-Anotate tool can be used the [online](http://devseed.com/ds-annotate) version with you custom values: 


- **classes**: List of classes for labeling.
- **name**: Project name
- **imagery_type**: Type of aerial Imagery:  `tms` or `wms`.
- **imagery_url**: Url for imagery service.
- **project_bbox**: Location where you need to focus on.


*Example:*

```
classes=farm,00FFFF|tree,FF00FF
project=Farms_mapping
imagery_type=tms
imagery_url=https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}?blankTile=false
project_bbox=-90.319317,38.482965,-90.247220,38.507418
```

[http://devseed.com/ds-annotate?classes=farm,00FFFF|tree,FF00FF&project=Farms-mapping&imagery_type=tms&imagery_url=https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}?blankTile=false&project_bbox=-90.319317,38.482965,-90.247220,38.507418](http://devseed.com/ds-annotate?classes=farm,00FFFF|tree,FF00FF&project=Farms-mapping&imagery_type=tms&imagery_url=https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}?blankTile=false&project_bbox=-90.319317,38.482965,-90.247220,38.507418)
### Starting the app

```
yarn serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:9000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

# Deployment
To prepare the app for deployment run:

```
yarn install
yarn start
```
