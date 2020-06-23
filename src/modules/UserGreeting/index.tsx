import { Container } from './style';
import { Button } from '@equinor/eds-core-react';
import GraphClient, { ProfileResponse } from '../../http/GraphClient';
import React, { useEffect, useState } from 'react';
import { Canceler } from 'axios';
import { useCurrentPlant } from '../../core/PlantContext';
import { useCurrentUser } from '../../core/UserContext';
import { useProcosysContext } from '../../core/ProcosysContext';

const UserGreeting = (): JSX.Element => {
    const user = useCurrentUser();
    const { auth } = useProcosysContext();
    const { plant } = useCurrentPlant();
    const [imageUrl, setImageUrl] = useState<string | null>();
    const [profileData, setProfileData] = useState<ProfileResponse | null>();
    let profileRequestToken: null | Canceler = null;
    let imageRequestToken: null | Canceler = null;
    const graphClient = new GraphClient(auth);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const imageData = await graphClient.getProfilePictureAsync((cancel) => { profileRequestToken = cancel; });
                const imageUrl = URL.createObjectURL(imageData);
                setImageUrl(imageUrl);
            } catch (error) {
                console.error(error);
            }

        })();

        return (): void => {
            imageRequestToken && imageRequestToken();
        };
    }, []);

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const data = await graphClient.getProfileDataAsync((cancel) => imageRequestToken = cancel);
                setProfileData(data);
            } catch (error) {
                console.error(error);
            }

        })();

        return (): void => {
            profileRequestToken && profileRequestToken();
        };
    }, []);

    const logout = (): void => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.assign('http://myapps.microsoft.com/');
    };

    return (
        <Container>
            <h1>{user.name}</h1>
            <h2>{(profileData && profileData.jobTitle) || 'Loading user data'}</h2>
            {(imageUrl && <img src={imageUrl} />) || 'Loading image'}
            <br />
            <h1>PLANT: {plant.title}</h1>

            <Button onClick={logout}>Logout</Button>
        </Container>
    );
};

export default UserGreeting;
