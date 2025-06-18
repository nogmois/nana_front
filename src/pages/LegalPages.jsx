// src/pages/LegalPages.jsx

import React from "react";
import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title, Paragraph, Text, Link } = Typography;

// Página de Termos de Uso
export function TermsPage() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
        <Title level={2}>Termos de Uso</Title>
        <Paragraph>
          Bem-vindo ao <Text strong>NanaFácil</Text>. Ao acessar ou usar este
          serviço, você concorda com estes Termos de Uso.
        </Paragraph>
        <Title level={4}>1. Definições</Title>
        <Paragraph>
          <Text strong>Serviço:</Text> plataforma NanaFácil para registro de
          eventos de bebês.
          <br />
          <Text strong>Usuário:</Text> pessoa que acessa o Serviço.
        </Paragraph>
        <Title level={4}>2. Uso do Serviço</Title>
        <Paragraph>
          Você concorda em usar o Serviço apenas para fins legais e de acordo
          com estes Termos. É proibido utilizar para atividades ilícitas ou
          violar direitos de terceiros.
        </Paragraph>
        <Title level={4}>3. Propriedade Intelectual</Title>
        <Paragraph>
          Todo conteúdo do Serviço, incluindo logos, textos e design, é
          protegido por direitos autorais e pertence ao NanaFácil ou
          licenciadores.
        </Paragraph>
        <Title level={4}>4. Limitação de Responsabilidade</Title>
        <Paragraph>
          O Serviço é fornecido “no estado em que se encontra”. O NanaFácil não
          assume responsabilidade por danos diretos, indiretos ou
          consequenciais.
        </Paragraph>
        <Title level={4}>5. Alterações</Title>
        <Paragraph>
          Podemos revisar estes Termos a qualquer momento. Notificaremos sobre
          mudanças significativas e a continuação do uso implica aceitação.
        </Paragraph>
        <Title level={4}>6. Lei Aplicável e Contato</Title>
        <Paragraph>
          Estes Termos são regidos pelas leis brasileiras. Para dúvidas, entre
          em contato pelo e-mail{" "}
          <Link href="mailto:contato@nanafacil.com">contato@nanafacil.com</Link>
          .
        </Paragraph>
      </Content>
    </Layout>
  );
}

// Página de Política de Privacidade
export function PrivacyPage() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
        <Title level={2}>Política de Privacidade</Title>
        <Paragraph>
          Esta Política de Privacidade explica como coletamos, usamos e
          protegemos seus dados ao usar o NanaFácil.
        </Paragraph>
        <Title level={4}>1. Dados Coletados</Title>
        <Paragraph>
          Coletamos informações fornecidas pelo Usuário, como e-mail, nome,
          dados de bebês (sonecas, mamadas) e dados técnicos (IP, navegador)
          para analytics.
        </Paragraph>
        <Title level={4}>2. Uso dos Dados</Title>
        <Paragraph>
          Utilizamos os dados para: autenticação, personalização da experiência,
          envio de notificações e melhorias no Serviço.
        </Paragraph>
        <Title level={4}>3. Compartilhamento</Title>
        <Paragraph>
          Não compartilhamos seus dados com terceiros, exceto quando exigido por
          lei ou para cumprir obrigações legais.
        </Paragraph>
        <Title level={4}>4. Segurança</Title>
        <Paragraph>
          Adotamos medidas técnicas para proteger seus dados contra acesso não
          autorizado, perda ou alteração.
        </Paragraph>
        <Title level={4}>5. Direitos do Usuário</Title>
        <Paragraph>
          Você pode solicitar acesso, correção ou exclusão de seus dados
          entrando em contato pelo e-mail{" "}
          <Link href="mailto:contato@nanafacil.com">contato@nanafacil.com</Link>
          .
        </Paragraph>
        <Title level={4}>6. Cookies e Analytics</Title>
        <Paragraph>
          Utilizamos cookies e ferramentas de analytics (p.ex., Google
          Analytics) para entender o uso do Serviço. Você pode desativar cookies
          no navegador.
        </Paragraph>
        <Title level={4}>7. Alterações nesta Política</Title>
        <Paragraph>
          Atualizaremos esta Política periodicamente. Notificaremos sobre
          mudanças significativas no app ou por e-mail.
        </Paragraph>
        <Title level={4}>8. Contato</Title>
        <Paragraph>
          Em caso de dúvidas, contate-nos:{" "}
          <Link href="mailto:contato@nanafacil.com">contato@nanafacil.com</Link>
          .
        </Paragraph>
      </Content>
    </Layout>
  );
}
