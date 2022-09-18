<?php

namespace Drush\Commands\playwright_commands;

use Drupal\node\NodeInterface;
use Drush\Commands\DrushCommands;

/**
 * Defines command for dealing with playwright testing requirements.
 */
class PlaywrightCommands extends DrushCommands {

  /**
   * Clone a node with given title.
   *
   * @param string $node_type
   *   Type of the node to clone.
   * @param string $node_title
   *   The title of node to be cloned.
   * @param string $new_node_title
   *   Title of the clone.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   *
   * @bootstrap full
   * @command test:node-clone
   * @aliases nc
   */
  public function cloneNodeByTitle($node_type, $node_title, $new_node_title) {
    $storage = \Drupal::entityTypeManager()->getStorage('node');
    $nodes = $storage->loadByProperties([
      'title' => $node_title,
      'type' => $node_type,
    ]);
    if (!$node = reset($nodes)) {
      throw new \RuntimeException('Unable to load node.');
    }
    $clone = $node->createDuplicate();
    $clone->title = $new_node_title;
    if ($clone->hasField('moderation_state')) {
      $clone->set('moderation_state', "published");
    }
    $clone->save();
  }

  /**
   * Gets id of node with given title.
   *
   * @param string $title
   *   Title of the node.
   *
   * @return string
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   *
   * @bootstrap full
   * @command test:node-get-id
   * @aliases ngid
   */
  public function getNodeIdWithTitle(string $title): string {
    $nodes = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties([
      'title' => $title,
    ]);
    foreach ($nodes as $node) {
      if ($node instanceof NodeInterface) {
        if ($node->getTitle() === $title) {
          return $node->id();
        }
      }
    }
    throw new \Exception("Could not find node with title '{$title}'");
  }

  /**
   * Gets path of node with given title.
   *
   * @param string $title
   *   Title of the node.
   *
   * @return string
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   *
   * @bootstrap full
   * @command test:node-get-path
   * @aliases ngpath
   */
  public function getNodePathWithTitle(string $title): string {
    $nodes = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties([
      'title' => $title,
    ]);
    if ($node = reset($nodes)) {
      return parse_url($node->toUrl()->toString(), PHP_URL_PATH);
    }
    throw new \Exception("Could not find node with title '{$title}'");
  }

  /**
   * Gets path alias of node with given title.
   *
   * @param string $title
   *   Title of the node.
   *
   * @return string
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   *
   * @bootstrap full
   * @command test:node-get-path-alias
   * @aliases ngpath-alias
   */
  public function getNodePathAliasWithTitle(string $title): string {
    $nodes = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties([
      'title' => $title,
    ]);
    if ($node = reset($nodes)) {
      return $this->getAliasManager()->getAliasByPath('/node/' . $node->id());
    }
    throw new \Exception("Could not find node with title '{$title}'");
  }

  /**
   * Clean-up content we created.
   *
   * @param string $keyword
   *   Title of the node.
   *
   * @bootstrap full
   * @command test:testsCleanUp
   * @aliases testcu
   */
  public function cleanUpContent(string $keyword) {
    $node_storage = \Drupal::entityTypeManager()->getStorage('node');
    $nids = $node_storage->getQuery()
      ->condition('title', $keyword, 'STARTS_WITH')
      ->execute();
    if (!empty($nids)) {
      $nodes = $node_storage->loadMultiple($nids);
      if (!empty($nodes)) {
        $node_storage->delete($nodes);
      }
    }
    $taxonomy_term_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
    $tids = $taxonomy_term_storage->getQuery()
      ->condition('name', $keyword, 'STARTS_WITH')
      ->execute();
    if (!empty($tids)) {
      $terms = $taxonomy_term_storage->loadMultiple($tids);
      if (!empty($terms)) {
        $taxonomy_term_storage->delete($terms);
      }
    }
  }
}
