import React from "react";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export const style = {
    button: {
        background: '#A6E3E9',
        borderRadius: 6,
        width: 120,
        height: 38,
        marginBottom: 50,
        marginTop: 40,
        color: '#F3F8FF',
        fontWeight: 600,
        fontSize: 16,
        fontFamily: 'Roboto, sans-serif',
        textTransform: 'none',
        '&:hover': {
            background: '#9BD1D7',
        },
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textInput: {
        width: 240,
        height: 40,
        padding: '0 10px',
        marginBottom: 20,
        background: '#F3F8FF',
        color: '#525E75',
        borderRadius: 6,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: 16,
        textTransform: 'none',
    },
    
    send: {
        marginTop: 20,
        background: '#4DAA56',
        color: '#F3F8FF',
        borderRadius: 6,
        width: 180,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 600,
        fontSize: 16,
        textTransform: 'none',
        '&:hover': {
            background: '#56BB60',
        },
    },

    box: {
        padding: '50px 80px',
        width: '45%',
        height: '50%',
        background: '#C9D4E9',
        outline: 'none',
        borderRadius: 8,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    mainContainer: {
        marginLeft: 73,
        width: '100%',
    },
};



export const StyledTextField = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
  ))(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        // marginBottom: 20,
        background: '#F3F8FF',
        color: '#525E75',
        borderRadius: 6,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 400,
        fontSize: 16,
        width: 240,
        textTransform: 'none',
        transition: theme.transitions.create([
            'border-color',
        ]),
        '&.Mui-focused fieldset': {
            borderColor: '#A6E3E9',
        },
        '&:hover fieldset': {
            borderColor: '#A6E3E9',
        },
    },
    '& label.Mui-focused': {
        color: '#525E75',
    },
}));