#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
import matter from 'gray-matter';

// 現在のディレクトリを取得
const currentDir = process.cwd();
const clineDir = path.join(currentDir, 'rules');
const clinerulesDest = path.join(currentDir, '..', '.clinerules');

// ファイルとメタデータの型定義
interface FileWithMeta {
  file: string;
  data: {
    title?: string;
    description?: string;
    category?: string;
    order?: number;
    [key: string]: any;
  };
  content: string;
}

/**
 * rulesディレクトリ内のルールファイルを取得する
 * @returns ルールファイルのリスト
 */
async function getRuleFiles(): Promise<string[]> {
  try {
    const files = await fs.promises.readdir(clineDir);
    return files.filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error('エラー: .clineディレクトリが見つかりません。', (error as Error).message);
    process.exit(1);
  }
}

/**
 * ファイルの内容を読み取り、Frontmatterを解析する
 * @param filePath ファイルパス
 * @returns ファイルの内容とFrontmatterデータ
 */
async function readFileWithFrontmatter(filePath: string): Promise<{ content: string; data: any }> {
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const { content, data } = matter(fileContent);
    return { content, data };
  } catch (error) {
    console.error(`エラー: ${filePath}を読み取れませんでした。`, (error as Error).message);
    return { content: '', data: {} };
  }
}

/**
 * ユーザーにルールファイルを選択させる
 * @param filesWithMeta ルールファイルとメタデータのリスト
 * @returns 選択されたファイルとメタデータのリスト
 */
async function selectRuleFiles(filesWithMeta: FileWithMeta[]): Promise<FileWithMeta[]> {
  // カテゴリごとにファイルをグループ化
  const categorizedFiles: { [category: string]: FileWithMeta[] } = {};
  filesWithMeta.forEach((item) => {
    const { data } = item;
    const category = data.category || 'uncategorized';
    if (!categorizedFiles[category]) {
      categorizedFiles[category] = [];
    }
    categorizedFiles[category].push(item);
  });

  // カテゴリごとに選択肢を作成
  const choices: any[] = [];
  
  // カテゴリの順序を定義（必要に応じて調整）
  const categoryOrder = ['development', 'documentation', 'frontend', 'api', 'uncategorized'];
  
  // カテゴリごとに選択肢を追加
  categoryOrder.forEach(category => {
    if (categorizedFiles[category] && categorizedFiles[category].length > 0) {
      // カテゴリの見出しを追加（選択不可）
      choices.push(new inquirer.Separator(`=== ${category.charAt(0).toUpperCase() + category.slice(1)} ===`));
      
      // カテゴリ内のファイルを追加
      categorizedFiles[category].forEach((item) => {
        const { file, data } = item;
        const title = data.title || file.replace('.md', '');
        const description = data.description ? ` - ${data.description}` : '';
        
        choices.push({
          name: `${title}${description}`,
          value: filesWithMeta.indexOf(item), // 元の配列内のインデックスを保持
          checked: false // デフォルトでは選択されていない
        });
      });
      
      // カテゴリの区切り線を追加
      choices.push(new inquirer.Separator(' '));
    }
  });

  const { selectedOptions } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedOptions',
      message: '含めるルールファイルを選択してください (<a>ですべて選択):',
      choices: choices,
      pageSize: 20 // 表示する選択肢の数
    }
  ]);

  // 選択されたインデックスに対応するファイルを返す
  return selectedOptions.map((index: number) => filesWithMeta[index]);
}

/**
 * 選択されたルールファイルの内容を結合して.clinerulesファイルを生成する
 * @param selectedFiles 選択されたファイルのリスト
 */
async function generateClinerules(selectedFiles: FileWithMeta[]): Promise<void> {
  if (selectedFiles.length === 0) {
    console.log('ルールファイルが選択されていません。');
    return;
  }

  console.log('\n選択されたルール:');
  selectedFiles.forEach(item => {
    const title = item.data.title || item.file.replace('.md', '');
    console.log(`- ${title}`);
  });

  // カテゴリを取得
  const categories = [...new Set(selectedFiles.map(item => item.data.category || 'uncategorized'))];

  let content = '# プロジェクトガイドライン\n\n';

  // カテゴリごとにルールをグループ化
  const categorizedRules: { [category: string]: FileWithMeta[] } = {};
  selectedFiles.forEach(item => {
    const category = item.data.category || 'uncategorized';
    if (!categorizedRules[category]) {
      categorizedRules[category] = [];
    }
    categorizedRules[category].push(item);
  });

  // 選択されたカテゴリ順にルールを追加
  for (const category of categories) {
    const rules = categorizedRules[category];
    if (!rules) continue;

    // カテゴリ名を追加（最初の文字を大文字に）
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    content += `## ${categoryName}\n\n`;

    // orderでソート
    rules.sort((a, b) => {
      const orderA = a.data.order || 999;
      const orderB = b.data.order || 999;
      return orderA - orderB;
    });

    // ルールを追加
    for (const rule of rules) {
      content += rule.content + '\n\n';
    }
  }
  
  console.log('\nカテゴリ構造:');
  categories.forEach(category => {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    const rulesCount = categorizedRules[category].length;
    console.log(`- ${categoryName} (${rulesCount}件のルール)`);
  });
  
  // 確認プロンプト
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '.clinerules ファイルを生成しますか？',
      default: true
    }
  ]);
  
  if (!confirm) {
    console.log('\n.clinerules ファイルの生成をキャンセルしました。');
    return;
  }

  // .clinerules ファイルに書き込む
  try {
    await fs.promises.writeFile(clinerulesDest, content);
    console.log(`\n.clinerules ファイルが正常に生成されました: ${clinerulesDest}`);
  } catch (error) {
    console.error('エラー: .clinerules ファイルの生成に失敗しました。', (error as Error).message);
  }
}

/**
 * メイン関数
 */
async function main(): Promise<void> {
  try {
    console.log('Cline Rules Generator');
    console.log('=====================');
    
    const files = await getRuleFiles();
    if (files.length === 0) {
      console.log('ルールファイルが見つかりませんでした。');
      return;
    }
    
    // ファイルとそのメタデータを取得
    const filesWithMeta = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(clineDir, file);
        const { content, data } = await readFileWithFrontmatter(filePath);
        return { file, data, content };
      })
    );
    
    const selectedFiles = await selectRuleFiles(filesWithMeta);
    await generateClinerules(selectedFiles);
  } catch (error) {
    console.error('予期しないエラーが発生しました:', error);
  }
}

// プログラムを実行
main();
