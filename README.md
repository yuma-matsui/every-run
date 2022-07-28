# every-run
This package enables you to record running logs easily.

## Description
You can record your running logs with this package.
It could be more useful if you run everyday.
Because it works with just typing `npx every-run`.

## Demo
When you use this package for the first time,
it asks you how long kilometers you run every day.
So please answer it.

```bash
% npx every-run
1日何km走りますか?
10
1日の目標距離を10kmに設定しました。
```

After that, just type `npx every-run`.
So it records your running log with the distance you set up.

```bash
% npx every-run
Great run!
```

## Requirement
- commander
- sqlite3
- typescript
- @types/node
- @types/sqlite3

## Usage

You can also use some options below.

- -y, -m

This shows your total log of specific year or month or both of them.

```bash
% npx every-run -y 2022
2022年の合計走行距離は10kmです。
```

```bash
% npx every-run -m 7
2022年7月の合計走行距離は10kmです。
```

```bash
% npx every-run -m 7 -y 2022
2022年7月の合計走行距離は10kmです。
```

- -e

This can record your extra running log when you ran more than your set up distance.

```bash
% npx every-run -e 20
Fantastic!! 目標より10km多く走りました!
```

- -u

This can change your set up distance.

```bash
% npx every-run -u 15
1日の目標距離を15kmに変更しました。
```

- -t

This shows your total running log from when you started recording log to latest.

```bash
% npx every-run -t
これまでの全走行距離は30kmです。
```

## Installation
```bash
$ npm install every-run
```

