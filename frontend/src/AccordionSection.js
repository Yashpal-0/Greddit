import React from 'react';
import PropTypes from 'prop-types';

class AccordionSection extends React.Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object),
    isOpen: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
  };

  onClick = () => {
    this.props.onClick(this.props.label);

  };

  render() {
    const {
      onClick,
      props: { isOpen, label },
    } = this;

    return (
      <div
        style={{
          background: isOpen ? '#ed9978' : '#ed9978',
          border: '1px  #ed9978',
          padding: '5px 10px',
        }}
      >
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
          {label}
          <div style={{ float: 'right' }}>
            {/* {!isOpen && <span>&#9650;</span>} */}
            {isOpen && <span>&#9660;</span>}
          </div>
        </div>
        {isOpen && (
          <div
            style={{
              background:"#f3bba5" ,
              border: '1px  #fceee9',
              borderRadius: '15px',
              marginTop: 10,
              padding: '10px 20px',
            }}
          >
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default AccordionSection;