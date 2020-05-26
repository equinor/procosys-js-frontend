import {hot} from 'react-hot-loader';

import React, {useState, useEffect} from 'react';
import {DetailsSection, Container, InformationContainer, TabBar, TabBarButton, TabBarFiller, Breadcrumbs} from './TagFunction.style';
import { TextField, Typography } from '@equinor/eds-core-react';
import { useProcosysContext } from '@procosys/core/ProcosysContext';
import { Canceler } from 'axios';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import Spinner from '@procosys/components/Spinner';

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

    const [tagFunctionData, setTagFunctionData] = useState<TagFunction|null>(null);

    const {procosysApiClient} = useProcosysContext();

    useEffect(() => {
        let requestCancellor: Canceler | null = null;
        (async (): Promise<void> => {
            try {
                const data = await procosysApiClient.getTagFunction(props.tagFunctionCode, props.registerCode, (cancel: Canceler) => requestCancellor = cancel);

                setTagFunctionData(data);
            } catch (error) {
                console.error('Get tag function details failed: ', error.messsage, error.data);
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
        return <Spinner />;
    }
    return (

        <Container>
            <Breadcrumbs>Library / Tag Function / ....</Breadcrumbs>
            <DetailsSection>
                <Typography variant="h3">{tagFunctionData.code}, {tagFunctionData.description}</Typography>
                <InformationContainer>
                    <div className="inputRow">
                        <TextField id="inp_register" value={tagFunctionData.registerDescription} label="Register" disabled />
                    </div>
                    <div className="inputRow">
                        <TextField id="inp_tag_function" value={tagFunctionData.code} label="Tag Function" disabled />
                    </div>
                    <div className="inputRow">
                        <TextField id="inp_description" value={tagFunctionData.description} label="Description" disabled />
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
                <section>{props.registerCode}</section>
            </section>

        </Container>
    );
};

export default hot(module)(TagFunction);
