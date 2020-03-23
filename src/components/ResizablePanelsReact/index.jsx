/* eslint-disable react/prop-types */
/* eslint-disable no-self-assign */
// eslint-disable-next-line react/no-find-dom-node
/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Components
import Resizer from './Resizer';

export default class ResizablePanels extends Component {
    constructor(props) {
        super(props);

        this.resizable = React.createRef();
        this.state = this.state;
    }
    state = {
        panelsSize: [],
        resizing: false
    };

    componentDidMount() {
        this.setState({ ...this.state, panelsSize: this.props.panelsSize });

        ReactDOM.findDOMNode(this).addEventListener(
            'mousemove',
            this.executeResize
        );
        ReactDOM.findDOMNode(this).addEventListener('mouseup', this.stopResize);
        ReactDOM.findDOMNode(this).addEventListener('mouseleave', this.stopResize);
    }

    render() {
        const { bkcolor } = this.props;
        const rest =
            this.props.children.length > 1 ? this.props.children.slice(1) : [];

        return (
            <div
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    background: bkcolor,
                    display: 'flex',
                    flexDirection: this.props.displayDirection || 'row'
                }}
                ref={this.resizable}
            >
                {this.renderFirst()}
                {this.renderRest(rest)}
            </div>
        );
    }

    renderFirst() {
        return this.renderChildren(this.props.children[0], 0);
    }

    renderRest(rest) {
        return [].concat(
            ...rest.map((children, index) => {
                return [
                    this.renderResizer(index + 1),
                    this.renderChildren(children, index + 1)
                ];
            })
        );
    }

    renderChildren(children, index) {
        return (
            <div
                className='resizable-fragment'
                key={'fragment_' + index}
                style={this.getStyle(index)}
            >
                {children}
            </div>
        );
    }

    renderResizer(index) {
        return (
            <Resizer
                size={this.props.resizerSize || '10px'}
                key={'resizer_' + index}
                direction={this.props.displayDirection}
                onMouseDown={e => this.startResize(e, index)}
                color={this.props.resizerColor}
            />
        );
    }

    displayDirectionIsColumn() {
        return this.props.displayDirection === 'column' ? true : false;
    }

    getStyle(index) {
        const panelsSize = this.state.panelsSize || [];
        const panelsSizeLength = panelsSize.length - 1;
        const size = index > panelsSizeLength ? '100%' : panelsSize[index];
        const unitMeasure = this.props.sizeUnitMeasure || 'px';

        if (this.displayDirectionIsColumn()) {
            return {
                height: `${size}${unitMeasure}`,
                width: '100%',
                overflow: 'hidden'
            };
        }

        return {
            height: '100%',
            width: `${size}${unitMeasure}`,
            overflow: 'hidden'
        };
    }

    startResize(e, index) {
        e.preventDefault();
        this.setState({
            ...this.state,
            resizing: true,
            currentPanel: index,
            initialPos: this.displayDirectionIsColumn() ? e.clientY : e.clientX
        });
    }

    executeResize = e => {
        if (this.state.resizing) {
            const currentMousePosition = this.displayDirectionIsColumn()
                ? e.clientY
                : e.clientX;

            const displacement = this.state.initialPos - currentMousePosition;

            const nextPanelsSize = this.getNextPanelsSize(displacement);

            this.setState({
                ...this.state,
                initialPos: currentMousePosition,
                panelsSize: nextPanelsSize,
                displacement
            });
        }
    };

    stopResize = () => {
        this.setState({
            ...this.state,
            resizing: false,
            currentPanel: null,
            displacement: 0
        });
    };

    getCurrentComponentSize() {
        const componentSizes = this.resizable.current.getBoundingClientRect();

        return this.displayDirectionIsColumn()
            ? componentSizes.height
            : componentSizes.width;
    }

    getNextPanelsSize(displacement) {
        const currentPanelsSize = this.state.panelsSize;
        const usePercentage = this.props.sizeUnitMeasure === '%';

        const resizeSize = usePercentage
            ? this.convertToPercentage(displacement)
            : displacement;

        const newPanelsSize = currentPanelsSize.map((panelSize, index) => {
            if (index === this.state.currentPanel) return panelSize + resizeSize;
            else if (index === this.state.currentPanel - 1)
                return panelSize - resizeSize;

            return panelSize;
        });

        return newPanelsSize;
    }

    convertToPercentage(displacement) {
        const size = this.getCurrentComponentSize();

        return (displacement * 100) / size;
    }
}