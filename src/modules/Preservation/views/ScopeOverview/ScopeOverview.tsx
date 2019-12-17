import { Container } from './ScopeOverview.style';
import React from 'react';
import { usePreservationContext } from '../../context/PreservationContext';

const ScopeOverview: React.FC = (): JSX.Element => {

    const {project} = usePreservationContext();

    return (
        <Container>
            <h1>Preservation tags</h1>
            <h3>{project.description}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Tag No</th>
                        <th>Tag Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>T-2000-HDF</td>
                        <td>This is a tag</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>T-1000-SJD</td>
                        <td>This is a tag</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>T-1000-SJD</td>
                        <td>This is a tag</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>T-1000-SJD</td>
                        <td>This is a tag</td>
                    </tr>
                </tbody>
            </table>
        </Container>
    );
};

export default ScopeOverview;
