import { Router } from "express";

/**
 * Classe abstrata BaseRouter.
 *
 * Fornece a estrutura base para definição de rotas associadas a um controlador específico.
 * Configura uma instância do Router do Express e exige que subclasses implementem a inicialização das rotas.
 *
 * @template T - Tipo do controlador associado a este router.
 */
export abstract class BaseRouter<T> {
  // Instância do Router do Express usada para definir as rotas.
  public router: Router;
  // Instância do controlador associada a este router.
  public controller: T;

  /**
   * Cria uma instância de BaseRouter.
   *
   * @param {T} controller - Controlador associado a este router.
   *
   * O construtor inicializa o Router, associa o controlador e chama o método abstrato
   * initRoutes() para configurar as rotas. Cada subclasse deve implementar initRoutes().
   */
  constructor(controller: T) {
    this.router = Router();
    this.controller = controller;
    this.initRoutes();
  }

  /**
   * Método abstrato para inicializar as rotas.
   *
   * Cada subclasse deve implementar este método para definir suas rotas e associar
   * os métodos do controlador ao Router do Express.
   */
  protected abstract initRoutes(): void;
}
