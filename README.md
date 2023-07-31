# Teste de contrato direcionado ao consumidor (DbC - Design by Contract)


[![Architetura de testes de contrato][contract-testing]](https://github.com/saulostopa)


## Sumário
<ul>
  <li><a href="#introdução">Introdução</a></li>
  <li><a href="#arquitetura-básica-do-teste-de-contrato">Arquitetura Básica do Teste de Contrato</a></li>
  <li><a href="#limitações-do-teste-de-contrato">Limitações do Teste de Contrato</a></li>
  <li><a href="#terminologias-abordadas">Terminologias Abordadas</a></li>
  <li><a href="#como-implementar">Como Implementar</a></li>
  <li><a href="#arquitetura-do-teste-de-contrato-com-pact-broker">Arquitetura do Teste de Contrato com Pact Broker</a></li>
  <li><a href="#mão-na-massa-com-pact">Mão na Massa com Pact</a></li>
  <li><a href="#teste-do-lado-do-consumidor">Teste do Lado do Consumidor</a></li>
  <li><a href="#teste-do-lado-do-provedor">Teste do Lado do Provedor</a></li>
  <li><a href="#conclusão">Conclusão</a></li>
</ul>

## Introdução

A estrutura de microsserviços tem sido uma tendência que várias empresas vêm se adaptando a essa prática nos últimos anos. Com os Microsserviços, grandes projetos de software são fragmentados em unidades ou elementos menores, que são desenvolvidos de forma autônoma por diferentes equipes. Cada um desses elementos distintos tem uma responsabilidade específica e possui sua própria infraestrutura para que as alterações possam ser testadas e implantadas de maneira independente mostrando inúmeros ganhos em relação à arquitetura monolítica. No entanto, com essa nova abordagem, também surgem novos obstáculos para os testes. Neste artigo, vamos explorar por que as técnicas de teste tradicionais podem não ser as mais adequadas para avaliar microsserviços e como podemos testá-los eficientemente usando testes de contrato.
    
A adoção de numerosos serviços menores e independentes traz vantagens, mas, por outro lado traz desafios em relação às abordagens de teste convencionais, já que a verificação de integração se torna complexa à medida que os pontos de conexão entre os diversos serviços aumentam. Técnicas de teste convencionais, como integração abrangente, podem parecer a melhor opção, porém esses testes se tornam problemáticos ao avaliar microsserviços, uma vez que eles são lentos, suscetíveis a erros e difíceis de manter, o que acarreta em um processo de retroalimentação lento. Além disso, exige ambientes end-to-end adequados nos quais os serviços são integrados entre si com os dados de teste necessários, configurações, etc. Se lidarmos com apenas dois serviços, essa forma de teste pode ser adequada, mas imagine quando houver centenas ou milhares de serviços diferentes se comunicando, tal qual a Amazon ou a Netflix. Como assegurar que todas as modificações realizadas não causem problemas em outros serviços? Como garantir a eficiência na manutenção dos dados de teste?
    
Os testes de integração ponta a ponta exigem que os ambientes de teste apropriados sejam conectados entre si, mas implementar essa abordagem para microsserviços pode acabar gerando mais desafios do que benefícios. Por outro lado, se optarmos por testes isolados e criarmos simulações para as dependências externas, sem dúvida os testes serão rápidos e fáceis de manter. Entretanto, quão confiantes estamos de que a simulação das dependências reflete fielmente o comportamento real do serviço? Como podemos solucionar esse problema? Felizmente, existe outra camada de teste que podemos aplicar para auxiliar na avaliação eficiente dos microsserviços.
    
O teste de contrato significa que verificamos nossa API em relação a um conjunto de expectativas (contratos). Isso significa que queremos verificar se ao receber uma chamada específica, nosso servidor provedor de API retornará os dados que especificamos na documentação. Muitas vezes não temos informações precisas sobre as necessidades de nossos consumidores de API. Para superar esse problema, os consumidores podem definir suas expectativas como simulações que usam em testes de unidade, criando contratos que esperam que cumpramos. Podemos reunir essas simulações e verificar se nosso provedor retorna os mesmos dados ou dados semelhantes quando chamado da mesma maneira que a simulação é configurada, essencialmente testando o limite do serviço. Essa abordagem é chamada de teste de contrato direcionado ao consumidor.

As vantagens do teste de contrato são que não há necessidade de ambientes integrados, pois as expectativas do cliente são registradas neste contrato e validadas em relação a um serviço de provedor simulado. O contrato é então carregado no Pact Broker e, em seguida, o provedor executa seu teste e verifica se tudo o que está escrito no contrato está correto.

Com o teste de contrato, embora estejamos usando um serviço simulado para validar nossos testes, isso ainda resolve os problemas de ter alterações quebradas implantadas na produção, pois os clientes são notificados quando há uma alteração implantada pelo provedor que causa a quebra do contrato e vice-versa.

Assim como contratos ou contratos da vida real, se houver uma alteração necessária a ser feita no contrato, ambas as partes serão notificadas e as alterações só serão feitas quando todos estiverem na mesma página e aprovarem.

<p align="right">(<a href="#top">Topo ^</a>)</p>

## Arquitetura Básica do Teste de Contrato
[![Architetura de testes de contrato direcionados ao consumidor][pact-flow]](https://example.com)

<p align="right">(<a href="#top">Topo ^</a>)</p>

## Limitações do Teste de Contrato

Apesar de tudo, você não pode usar o teste de contrato apenas ao testar microsserviços e não substitui as comunicações reais entre equipes diferentes. O teste de contrato não substitui os testes funcionais, pois não estamos testando o comportamento de nossos serviços. Também não é aconselhável usar testes de contrato se você tiver uma API pública porque não sabe quantos clientes você tem e como eles usam seu serviço.
    
<p align="right">(<a href="#top">Topo ^</a>)</p>


## Terminologias Abordadas
1. **Consumidor** - Serviço que consome dados de um provedor
2. **Provedor** - Serviço que fornece dados a um consumidor
3. **Contrato/Pacto** - Documento de base do contrato entre o consumidor e o fornecedor (geralmente em formato JSON que captura quais solicitações o consumidor precisa do provedor e quais tipos de dados, códigos de status e respostas o provedor retornará)
4. **Pact Broker** - Serviço hospedado que armazena todo o contrato (canal de comunicação entre consumidores e fornecedores)

<p align="right">(<a href="#top">Topo ^</a>)</p>

## Como Implementar

Para implementar o teste de contrato, utilizaremos a ferramenta [Pact](https://docs.pact.io/) de contrato de código aberto. No link a seguir você pode ver o passo a passo de como a metodologia funciona: [Como funciona o teste de contrato Pact](https://pactflow.io/how-pact-works/?utm_source=ossdocs&utm_campaign=getting_started#slide-1)

Ela nos oferece tudo o que é necessário para criar, distribuir e validar contratos dentro de um sistema. Ele suporta a maioria dos idiomas usuais e o uso de várias línguas em uma arquitetura. Pact abrange o cenário de contrato orientado ao cliente e automatiza a maior parte do processo.

O fluxo começa com a definição pelo cliente dos testes de unidade: qual resposta o cliente espera em qual estado? É importante observar que o cliente deve testar a interação com e não a funcionalidade do provedor. Se o cliente puder processar uma resposta, mas o teste falhar, provavelmente você está testando a funcionalidade do provedor. Isso deve ser testado com testes de unidade de provedor.

Por exemplo, considere um serviço de validação que retorne verdadeiro ou falso com base na entrada. Um cliente pode testar se o serviço de validação retorna falso quando a entrada excede um determinado número de caracteres. Mas o serviço de validação é responsável por esse limite de caracteres. Deve ser verificado em seus testes de unidade e não no contrato.

A cada alteração que o cliente fizer, um contrato será criado e enviado ao mediador Pacto. Quando o provedor fizer uma alteração, todos os contratos do cliente serão recuperados do mediador. Um servidor simulado reproduzirá as solicitações de contrato com os contratos. Se as respostas estiverem em contrato com o contrato, o provedor pode implantar as alterações.

## Arquitetura do Teste de Contrato com Pact Broker

[![Architetura de testes de contrato direcionados ao consumidor com Pact Broker][pact-flow-broker]](https://example.com)

<p align="right">(<a href="#top">Topo ^</a>)</p>


<!-- GETTING STARTED -->
## Mão na Massa com Pact

A principal interface do consumidor são a classe PactV3 e as exportações MatchersV3 do pacote @pact-foundation/pact, para que o consumidor possa escrever um teste de API e definir suas suposições e necessidades de seu(s) provedor(es) de API. Ao testar a unidade de nosso cliente de API com o Pact, ele produzirá um contrato que podemos compartilhar com nosso provedor para confirmar essas suposições e evitar alterações prejudiciais.

Neste exemplo, vamos testar nosso cliente User API, responsável por se comunicar com o UserAPI por HTTP. Atualmente, ele possui um único método GetUser(id) que retornará um *User*.

Os testes de pacto têm algumas propriedades importantes conforme demonstrado abaixo.


### Teste do Lado do Consumidor

  ```sh
  import { PactV3, MatchersV3 } from '@pact-foundation/pact';

  // Criando um 'pacto' entre as duas aplicações na integração que estamos testando
  const provider = new PactV3({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'MyConsumer',
    provider: 'MyProvider',
  });

  // API do cliente que buscará a API Dog
  // Este é o alvo do nosso teste Pact
  public getMeDogs = (from: string): AxiosPromise => {
    return axios.request({
      baseURL: this.url,
      params: { from },
      headers: { Accept: 'application/json' },
      method: 'GET',
      url: '/dogs',
    });
  };

  const dogExample = { dog: 1 };
  const EXPECTED_BODY = MatchersV3.eachLike(dogExample);

  describe('GET /dogs', () => {
    it('returns an HTTP 200 and a list of docs', () => {
      // Configurando nossas interações esperadas e
      // usando o Pact para simular a API de back-end
      provider
        .given('I have a list of dogs')
        .uponReceiving('a request for all dogs with the builder pattern')
        .withRequest({
          method: 'GET',
          path: '/dogs',
          query: { from: 'today' },
          headers: { Accept: 'application/json' },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: EXPECTED_BODY,
        });

      return provider.executeTest((mockserver) => {
        // Testando se nosso cliente API se comporta corretamente
        // Observe que configuramos o cliente da API DogService dinamicamente para
        // apontar para o pacto de serviço simulado criado anteriormente

        dogService = new DogService(mockserver.url);
        const response = await dogService.getMeDogs('today')

        // Assert: check the result
        expect(response.data[0]).to.deep.eq(dogExample);
      });
    });
  });
  ```

<p align="right">(<a href="#top">Topo ^</a>)</p>

### Teste do Lado do Provedor

A principal interface do provedor é a classe Verifier do pacote @pact-foundation/pact. Um teste de provedor usa um ou mais arquivos de pacto (contratos) como entrada e o Pact verifica se seu provedor cumpre o contrato. No caso mais simples, você pode verificar um provedor conforme abaixo usando um arquivo de pacto local, embora na prática você normalmente use um Pact Broker como mencionado anteriormente para gerenciar seus contratos e fluxo de trabalho de CI/CD.

```
const { Verifier } = require('@pact-foundation/pact');

// 1 - Iniciando o provedor localmente. Certifique-se de eliminar quaisquer dependências externas
server.listen(8081, () => {
  importData();
  console.log('ouvindo o serviço de perfil do animal em http://localhost:8081');
});

// 2 - Verificando se o provedor atende a todas as expectativas do consumidor
describe('Pact Verification', () => {
  it('validates the expectations of Matching Service', () => {
    let token = 'INVALID TOKEN';

    return new Verifier({
      providerBaseUrl: 'http://localhost:8081', // <- localização do seu provedor em execução
      pactUrls: [ path.resolve(process.cwd(), "./pacts/SomeConsumer-SomeProvider.json") ],
    })
      .verifyProvider()
      .then(() => {
        console.log('Verificação do Pacto Concluída com Sucesso!');
      });
  });
});
```
<p align="right">(<a href="#top">Topo ^</a>)</p>

## Conclusão

O teste de contrato voltado para o cliente é um conceito muito poderoso que podemos utilizar não apenas para verificar a segurança dos limites do serviço, mas também para projetar e simplificar nossas APIs. Compreender quais são as exigências dos clientes nos poupa de muitas suposições ao planejarmos nossas tarefas e escrevermos nosso código. Além disso, é mais fácil e rápido do que configurar testes de integração apropriados entre os serviços, pois não precisamos ter dois serviços ativos comunicando-se entre si.

Se não controlarmos todos os consumidores de nossas APIs, as necessidades exatas de nossos consumidores podem se perder na tradução. Mesmo que nossos testes de integração detectem o problema, podemos não saber se detectamos um bug no consumidor ou se não cumprimos nossos contratos adequadamente.

Provavelmente, você não deseja interromper uma tarefa de CI/CD quando uma verificação de contrato falha, porque um erro de digitação em apenas uma simulação do cliente pode impedir que você lance um novo lançamento. No entanto, pode ser útil descobrir rapidamente por que ocorreu um erro apenas observando o status de verificação de um contrato.

O Pact e o Pact Broker são ferramentas impressionantes para testes de contrato direcionados ao cliente e podem fazer parte do conjunto de ferramentas de qualquer desenvolvedor que trabalha com sistemas distribuídos. Se tivesse alguns recursos de asserção mais refinados, poderíamos substituir alguns casos de teste que atualmente só podem ser verificados usando testes de integração complexos.

<p align="right">(<a href="#top">Topo ^</a>)</p>


## Autor

Saulo Stopa - [@saulostopa](https://saulostopa.com) - saulostopa@gmail.com

WebSite: [https://saulostopa.com](https://saulostopa.com)

<p align="right">(<a href="#top">Topo ^</a>)</p>


[pact-flow]: images/pact-demand-flow.png
[pact-flow-broker]: images/pact-demand-flow-broker.png
[contract-testing]: images/contract_testing.png