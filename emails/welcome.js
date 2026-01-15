// emails/welcome

import { Html, Button, Head, Body, Container, Heading } from '@react-email/components';

export default function WelcomeEmail({ name }) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>Welcome, {name}!</Heading>
          <Button href="https://formoteka.com">Get Started</Button>
        </Container>
      </Body>
    </Html>
  );
}
