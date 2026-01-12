// components/filters/FilterBar.tsx
import { Row, Col, Button, Container } from "react-bootstrap";
import { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  onReset?: () => void;
  showReset?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  onReset,
  showReset = true,
}) => {
  return (
    <Container fluid="md" className="mb-3">
      <Row className="align-items-center g-2">
        {children}
        {showReset && onReset && (
          <Col xs="auto">
            <Button variant="outline-secondary" onClick={onReset} size="sm">
              Reset Filters
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};