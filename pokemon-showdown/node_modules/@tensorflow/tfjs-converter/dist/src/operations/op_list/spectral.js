"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = [
    {
        'tfOpName': 'FFT',
        'dlOpName': 'fft',
        'category': 'spectral',
        'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
    },
    {
        'tfOpName': 'IFFT',
        'dlOpName': 'ifft',
        'category': 'spectral',
        'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
    },
    {
        'tfOpName': 'RFFT',
        'dlOpName': 'rfft',
        'category': 'spectral',
        'params': [
            { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                'tfInputIndex': 1,
                'dlParamName': 'fft_length',
                'type': 'number',
                'unsupported': true
            }
        ]
    },
    {
        'tfOpName': 'IRFFT',
        'dlOpName': 'irfft',
        'category': 'spectral',
        'params': [
            { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                'tfInputIndex': 1,
                'dlParamName': 'fft_length',
                'type': 'number',
                'unsupported': true
            }
        ]
    }
];
//# sourceMappingURL=spectral.js.map