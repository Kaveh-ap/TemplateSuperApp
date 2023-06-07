import { Component, type ComponentType, type ReactNode } from 'react';

import React from 'react';
import FallbackComponent, { type Props as FallbackComponentProps } from './FallbackComponent';

export type Props = {
  children: Exclude<NonNullable<ReactNode>, string | number | boolean>;
  FalbackComp: ComponentType<FallbackComponentProps>;
  onError?: (error: Error, stackTrace: string) => void;
};

type State = { error: Error | null };

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static defaultProps: {
    FalbackComp: ComponentType<FallbackComponentProps>;
  } = {
    FalbackComp: FallbackComponent,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info.componentStack);
    }
  }

  resetError: () => void = () => {
    this.setState({ error: null });
  };

  render(): any {
    const { FalbackComp } = this.props;

    return this.state.error ? (
      <FalbackComp error={this.state.error} resetError={this.resetError} />
    ) : (
      this.props.children
    );
  }
}

export default ErrorBoundary;
