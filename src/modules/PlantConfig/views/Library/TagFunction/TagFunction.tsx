import {
    Breadcrumbs,
    Container,
    DetailsSection,
    InformationContainer,
    Section,
    SpinnerContainer,
    TabBar,
    TabBarButton,
    TabBarFiller,
} from './TagFunction.style';
import React, { useEffect, useState } from 'react';
import { TextField, Typography } from '@equinor/eds-core-react';

import { Canceler } from 'axios';
import PreservationTab from './tabs/PreservationTab';
import Spinner from '@procosys/components/Spinner';
import { hot } from 'react-hot-loader';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import { useProcosysContext } from '@procosys/core/ProcosysContext';

type TagFunctionProps = {
    tagFunctionCode: string;
    registerCode: string;
};

interface TagFunction {
    id: number;
    code: string;
    description: string;
    registerDescription: string;
}

const TagFunction = (props: TagFunctionProps): JSX.Element => {
    const [tagFunctionData, setTagFunctionData] = useState<TagFunction | null>(
        null
    );

    const { procosysApiClient } = useProcosysContext();

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await procosysApiClient.getTagFunction(
                    props.tagFunctionCode,
                    props.registerCode,
                    (cancel: Canceler) => (requestCancellor = cancel)
                );
                setTagFunctionData(data);
            } catch (error) {
                console.error(
                    'Get tag function details failed: ',
                    error.message,
                    error.data
                );
                showSnackbarNotification(error.message, 5000);
            }
        })();

        return (): void => {
            requestCancellor && requestCancellor();
        };
    }, [props]);

    useEffect(() => {
        setTagFunctionData(null);
    }, [props]);

    if (!tagFunctionData) {
        return (
            <SpinnerContainer>
                <Spinner large />
                <Typography variant="h3">Loading library data</Typography>
            </SpinnerContainer>
        );
    }
    return (
        <Container>
            <Breadcrumbs>
                Library / Tag functions / {tagFunctionData.registerDescription}{' '}
                / {tagFunctionData.code}, {tagFunctionData.description}
            </Breadcrumbs>
            <DetailsSection>
                <Typography variant="h3">
                    {tagFunctionData.code}, {tagFunctionData.description}
                </Typography>
                <InformationContainer>
                    <div className="inputRow">
                        <TextField
                            id="inp_register"
                            value={tagFunctionData.registerDescription}
                            label="Register"
                            disabled
                        />
                    </div>
                    <div className="inputRow">
                        <TextField
                            id="inp_tag_function"
                            value={tagFunctionData.code}
                            label="Tag function"
                            disabled
                        />
                    </div>
                    <div className="inputRow">
                        <TextField
                            id="inp_description"
                            value={tagFunctionData.description}
                            label="Description"
                            disabled
                        />
                    </div>
                </InformationContainer>
            </DetailsSection>
            <Section>
                <TabBar>
                    {/* <TabBarButton disabled>
                        Completion
                    </TabBarButton > */}
                    <TabBarButton current>Preservation</TabBarButton>
                    {/* <TabBarButton disabled>
                        DCCL
                    </TabBarButton>
                    <TabBarButton disabled>
                        CPCL
                    </TabBarButton>
                    <TabBarButton disabled>
                        Running logs
                    </TabBarButton>
                    <TabBarButton disabled>
                        Document requirement
                    </TabBarButton>
                    <TabBarButton disabled>
                        SPIR Requirement
                    </TabBarButton> */}
                    <TabBarFiller>
                        {/* Just fills out the empty space */}
                    </TabBarFiller>
                </TabBar>
                <Section>
                    <PreservationTab
                        registerCode={props.registerCode}
                        tagFunctionCode={props.tagFunctionCode}
                    />
                </Section>
            </Section>
        </Container>
    );
};

export default hot(module)(TagFunction);
