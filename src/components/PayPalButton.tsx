import React, { useEffect, useRef } from 'react';

interface PayPalButtonProps {
  amount: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    paypal: any;
  }
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  onSuccess,
  onError,
  onCancel,
  disabled = false
}) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.paypal || !paypalRef.current || disabled) return;

    const paypalButtons = window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        try {
          const details = await actions.order.capture();
          onSuccess(details);
        } catch (error) {
          onError(error);
        }
      },
      onError: (error: any) => {
        onError(error);
      },
      onCancel: () => {
        if (onCancel) onCancel();
      },
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      }
    });

    if (paypalRef.current) {
      paypalButtons.render(paypalRef.current);
    }

    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }
    };
  }, [amount, onSuccess, onError, onCancel, disabled]);

  if (disabled) {
    return (
      <div className="bg-gray-200 text-gray-500 px-6 py-3 rounded-lg text-center">
        Payment Disabled
      </div>
    );
  }

  return <div ref={paypalRef} className="paypal-button-container"></div>;
};