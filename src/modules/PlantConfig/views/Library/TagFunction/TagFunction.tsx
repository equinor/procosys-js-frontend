import React from 'react';
import { Breadcrumbs } from './TagFunction.style';
import {hot} from 'react-hot-loader';
import {DetailsSection, Container, InformationContainer, TabBar, TabBarButton, TabBarFiller} from './TagFunction.style';
import { TextField, Typography } from '@equinor/eds-core-react';

type TagFunctionProps = {
    tagFunctionId: string;
};

const TagFunction = (props: TagFunctionProps): JSX.Element => {
    return (

        <Container>
            <Breadcrumbs>Library / Tag Function / ....</Breadcrumbs>
            <DetailsSection>
                <Typography variant="h3">TF.test, TF.Description</Typography>
                <InformationContainer>
                    <div className="inputRow">
                        <TextField id="inp_register" label="Register" disabled />
                    </div>
                    <div className="inputRow">
                        <TextField id="inp_tag_function" label="Tag Function" disabled />
                    </div>
                    <div className="inputRow">
                        <TextField id="inp_description" label="Description" disabled />
                    </div>
                </InformationContainer>
            </DetailsSection>
            <section>
                <TabBar>
                    <TabBarButton current>
                        Completion
                    </TabBarButton>
                    <TabBarButton disabled>
                        Preservation
                    </TabBarButton>
                    <TabBarButton>
                        DCCL
                    </TabBarButton>
                    <TabBarButton>
                        CPCL
                    </TabBarButton>
                    <TabBarButton>
                        Running logs
                    </TabBarButton>
                    <TabBarButton>
                        Document requirement
                    </TabBarButton>
                    <TabBarButton>
                        SPIR Requirement
                    </TabBarButton>
                    <TabBarFiller>
                        {/* Just fills out the empty space */}
                    </TabBarFiller>
                </TabBar>
                <section>{props.tagFunctionId}</section>
            </section>

        </Container>
    );
};

export default hot(module)(TagFunction);
