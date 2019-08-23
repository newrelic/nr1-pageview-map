import React from 'react';
import PropTypes from 'prop-types';
import {Grid, GridItem, Stack, StackItem} from 'nr1';
import imageOne from './screenshots/screenshot.png';

export default class WelcomePage extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
    };

    render() {
        return (
            <Grid>
                <GridItem columnStart={2} columnEnd={5}>
                    <Stack directionType={Stack.DIRECTION_TYPE.VERTICAL}
                           distributionType={Stack.DISTRIBUTION_TYPE.CENTER}
                           alignmentType={Stack.ALIGNMENT_TYPE.CENTER}
                           className='instructions'>
                        <StackItem>
                            <h1>Accesing Your Nerdlet</h1>
                            <p>1. On the New Relic One homepage, go to Entity Explorer</p>
                            <p>2. Click on `Browswer Applications` category in the left-hand navigation</p>
                            <p>3. Click on the app you're interested in</p>
                            <p>4. You should now see a menu option in the left-hand navigation called `Page View Map`.
                                Click on it</p>
                            <p>5. From the top right corner you can choose either a time range of the data you're
                                interested in, or predefined duration.</p>
                            <p>6. When you click on a Marker, you will see the details for this location.</p>
                        </StackItem>
                    </Stack>
                </GridItem>
                <GridItem columnStart={6} columnEnd={12}>
                    <img src={imageOne} />
                </GridItem>
            </Grid>
        );
    }
}
